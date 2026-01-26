"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendar = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const uuid_1 = require("uuid");
const CalendarDescription_1 = require("./CalendarDescription");
const EventDescription_1 = require("./EventDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const utilities_1 = require("../../../utils/utilities");
const preBuiltAgentsCallout = {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
    displayName: 'Interact with your Google Calendar using our pre-built',
    name: 'preBuiltAgentsCalloutGoogleCalendar',
    type: 'callout',
    typeOptions: {
        calloutAction: {
            label: 'Calendar agent',
            icon: 'bot',
            type: 'openSampleWorkflowTemplate',
            templateId: 'calendar_agent_with_gcal',
        },
    },
    default: '',
};
class GoogleCalendar {
    description = {
        displayName: 'Google Calendar',
        name: 'googleCalendar',
        icon: 'file:googleCalendar.svg',
        group: ['input'],
        version: [1, 1.1, 1.2, 1.3],
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Google Calendar API',
        defaults: {
            name: 'Google Calendar',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'googleCalendarOAuth2Api',
                required: true,
            },
        ],
        properties: [
            preBuiltAgentsCallout,
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Calendar',
                        value: 'calendar',
                    },
                    {
                        name: 'Event',
                        value: 'event',
                    },
                ],
                default: 'event',
            },
            ...CalendarDescription_1.calendarOperations,
            ...CalendarDescription_1.calendarFields,
            ...EventDescription_1.eventOperations,
            ...EventDescription_1.eventFields,
            {
                displayName: 'This node will use the time zone set in n8n’s settings, but you can override this in the workflow settings',
                name: 'useN8nTimeZone',
                type: 'notice',
                default: '',
            },
        ],
    };
    methods = {
        listSearch: {
            getCalendars: GenericFunctions_1.getCalendars,
            getTimezones: GenericFunctions_1.getTimezones,
        },
        loadOptions: {
            // Get all the calendars to display them to user so that they can
            // select them easily
            async getConferenceSolutions() {
                const returnData = [];
                const calendar = this.getCurrentNodeParameter('calendar', { extractValue: true });
                const possibleSolutions = {
                    eventHangout: 'Google Hangout',
                    eventNamedHangout: 'Google Hangout Classic',
                    hangoutsMeet: 'Google Meet',
                };
                const { conferenceProperties: { allowedConferenceSolutionTypes }, } = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/users/me/calendarList/${calendar}`);
                for (const solution of allowedConferenceSolutionTypes) {
                    returnData.push({
                        name: possibleSolutions[solution],
                        value: solution,
                    });
                }
                return returnData;
            },
            // Get all the colors to display them to user so that they can
            // select them easily
            async getColors() {
                const returnData = [];
                const { event } = await GenericFunctions_1.googleApiRequest.call(this, 'GET', '/calendar/v3/colors');
                for (const key of Object.keys(event)) {
                    const colorName = `Background: ${event[key].background} - Foreground: ${event[key].foreground}`;
                    const colorId = key;
                    returnData.push({
                        name: `${colorName}`,
                        value: colorId,
                    });
                }
                return returnData;
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        const qs = {};
        const hints = [];
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const timezone = this.getTimezone();
        const nodeVersion = this.getNode().typeVersion;
        for (let i = 0; i < length; i++) {
            try {
                if (resource === 'calendar') {
                    //https://developers.google.com/calendar/v3/reference/freebusy/query
                    if (operation === 'availability') {
                        // we need to decode once because calendar used to be saved encoded
                        const calendarId = decodeURIComponent(this.getNodeParameter('calendar', i, '', { extractValue: true }));
                        const timeMin = (0, GenericFunctions_1.dateObjectToISO)(this.getNodeParameter('timeMin', i));
                        const timeMax = (0, GenericFunctions_1.dateObjectToISO)(this.getNodeParameter('timeMax', i));
                        const options = this.getNodeParameter('options', i);
                        const outputFormat = options.outputFormat || 'availability';
                        const tz = this.getNodeParameter('options.timezone', i, '', {
                            extractValue: true,
                        });
                        const body = {
                            timeMin: (0, moment_timezone_1.default)(timeMin).utc().format(),
                            timeMax: (0, moment_timezone_1.default)(timeMax).utc().format(),
                            items: [
                                {
                                    id: calendarId,
                                },
                            ],
                            timeZone: tz || timezone,
                        };
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'POST', '/calendar/v3/freeBusy', body, {});
                        if (responseData.calendars[calendarId].errors) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData.calendars[calendarId], {
                                itemIndex: i,
                            });
                        }
                        if (outputFormat === 'availability') {
                            responseData = {
                                available: !responseData.calendars[calendarId].busy.length,
                            };
                        }
                        else if (outputFormat === 'bookedSlots') {
                            responseData = responseData.calendars[calendarId].busy;
                        }
                    }
                }
                if (resource === 'event') {
                    //https://developers.google.com/calendar/v3/reference/events/insert
                    if (operation === 'create') {
                        const calendarId = (0, GenericFunctions_1.encodeURIComponentOnce)(this.getNodeParameter('calendar', i, '', { extractValue: true }));
                        const start = (0, GenericFunctions_1.dateObjectToISO)(this.getNodeParameter('start', i));
                        const end = (0, GenericFunctions_1.dateObjectToISO)(this.getNodeParameter('end', i));
                        const useDefaultReminders = this.getNodeParameter('useDefaultReminders', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.maxAttendees) {
                            qs.maxAttendees = additionalFields.maxAttendees;
                        }
                        if (additionalFields.sendNotifications) {
                            qs.sendNotifications = additionalFields.sendNotifications;
                        }
                        if (additionalFields.sendUpdates) {
                            qs.sendUpdates = additionalFields.sendUpdates;
                        }
                        const body = {
                            start: {
                                dateTime: moment_timezone_1.default.tz(start, timezone).utc().format(),
                                timeZone: timezone,
                            },
                            end: {
                                dateTime: moment_timezone_1.default.tz(end, timezone).utc().format(),
                                timeZone: timezone,
                            },
                        };
                        if (additionalFields.attendees) {
                            body.attendees = [];
                            additionalFields.attendees.forEach((attendee) => {
                                body.attendees.push.apply(body.attendees, attendee
                                    .split(',')
                                    .map((a) => a.trim())
                                    .map((email) => ({ email })));
                            });
                        }
                        if (additionalFields.color) {
                            body.colorId = additionalFields.color;
                        }
                        if (additionalFields.description) {
                            body.description = additionalFields.description;
                        }
                        if (additionalFields.guestsCanInviteOthers) {
                            body.guestsCanInviteOthers = additionalFields.guestsCanInviteOthers;
                        }
                        if (additionalFields.guestsCanModify) {
                            body.guestsCanModify = additionalFields.guestsCanModify;
                        }
                        if (additionalFields.guestsCanSeeOtherGuests) {
                            body.guestsCanSeeOtherGuests = additionalFields.guestsCanSeeOtherGuests;
                        }
                        if (additionalFields.id) {
                            body.id = additionalFields.id;
                        }
                        if (additionalFields.location) {
                            body.location = additionalFields.location;
                        }
                        if (additionalFields.summary) {
                            body.summary = additionalFields.summary;
                        }
                        if (additionalFields.showMeAs) {
                            body.transparency = additionalFields.showMeAs;
                        }
                        if (additionalFields.visibility) {
                            body.visibility = additionalFields.visibility;
                        }
                        if (!useDefaultReminders) {
                            const reminders = this.getNodeParameter('remindersUi', i)
                                .remindersValues;
                            body.reminders = {
                                useDefault: false,
                            };
                            if (reminders) {
                                body.reminders.overrides = reminders;
                            }
                        }
                        if (additionalFields.allday === 'yes') {
                            body.start = {
                                date: timezone
                                    ? moment_timezone_1.default.tz(start, timezone).utc(true).format('YYYY-MM-DD')
                                    : moment_timezone_1.default.tz(start, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                            };
                            body.end = {
                                date: timezone
                                    ? moment_timezone_1.default.tz(end, timezone).utc(true).format('YYYY-MM-DD')
                                    : moment_timezone_1.default.tz(end, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                            };
                        }
                        //exampel: RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=10;UNTIL=20110701T170000Z
                        //https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
                        body.recurrence = [];
                        if (additionalFields.rrule) {
                            body.recurrence = [`RRULE:${additionalFields.rrule}`];
                        }
                        else {
                            if (additionalFields.repeatHowManyTimes && additionalFields.repeatUntil) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), "You can set either 'Repeat How Many Times' or 'Repeat Until' but not both", { itemIndex: i });
                            }
                            if (additionalFields.repeatFrecuency) {
                                body.recurrence?.push(`FREQ=${additionalFields.repeatFrecuency.toUpperCase()};`);
                            }
                            if (additionalFields.repeatHowManyTimes) {
                                body.recurrence?.push(`COUNT=${additionalFields.repeatHowManyTimes};`);
                            }
                            if (additionalFields.repeatUntil) {
                                const repeatUntil = (0, moment_timezone_1.default)(additionalFields.repeatUntil)
                                    .utc()
                                    .format('YYYYMMDDTHHmmss');
                                body.recurrence?.push(`UNTIL=${repeatUntil}Z`);
                            }
                            if (body.recurrence.length !== 0) {
                                body.recurrence = [`RRULE:${body.recurrence.join('')}`];
                            }
                        }
                        if (additionalFields.conferenceDataUi) {
                            const conferenceData = additionalFields.conferenceDataUi
                                .conferenceDataValues;
                            if (conferenceData) {
                                qs.conferenceDataVersion = 1;
                                body.conferenceData = {
                                    createRequest: {
                                        requestId: (0, uuid_1.v4)(),
                                        conferenceSolution: {
                                            type: conferenceData.conferenceSolution,
                                        },
                                    },
                                };
                            }
                        }
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'POST', `/calendar/v3/calendars/${calendarId}/events`, body, qs);
                    }
                    //https://developers.google.com/calendar/v3/reference/events/delete
                    if (operation === 'delete') {
                        const calendarId = (0, GenericFunctions_1.encodeURIComponentOnce)(this.getNodeParameter('calendar', i, '', { extractValue: true }));
                        const eventId = this.getNodeParameter('eventId', i);
                        const options = this.getNodeParameter('options', i);
                        if (options.sendUpdates) {
                            qs.sendUpdates = options.sendUpdates;
                        }
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/calendar/v3/calendars/${calendarId}/events/${eventId}`, {});
                        responseData = { success: true };
                    }
                    //https://developers.google.com/calendar/v3/reference/events/get
                    if (operation === 'get') {
                        const calendarId = (0, GenericFunctions_1.encodeURIComponentOnce)(this.getNodeParameter('calendar', i, '', { extractValue: true }));
                        const eventId = this.getNodeParameter('eventId', i);
                        const options = this.getNodeParameter('options', i);
                        const tz = this.getNodeParameter('options.timeZone', i, '', {
                            extractValue: true,
                        });
                        if (options.maxAttendees) {
                            qs.maxAttendees = options.maxAttendees;
                        }
                        if (tz) {
                            qs.timeZone = tz;
                        }
                        responseData = (await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events/${eventId}`, {}, qs));
                        if (responseData) {
                            if (nodeVersion >= 1.3 && options.returnNextInstance && responseData.recurrence) {
                                const eventInstances = (await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events/${responseData.id}/instances`, {}, {
                                    timeMin: new Date().toISOString(),
                                    maxResults: 1,
                                })).items || [];
                                responseData = eventInstances[0] ? [eventInstances[0]] : [responseData];
                            }
                            else {
                                responseData = (0, GenericFunctions_1.addNextOccurrence)([responseData]);
                            }
                        }
                    }
                    //https://developers.google.com/calendar/v3/reference/events/list
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const calendarId = (0, GenericFunctions_1.encodeURIComponentOnce)(this.getNodeParameter('calendar', i, '', { extractValue: true }));
                        const options = this.getNodeParameter('options', i);
                        const tz = this.getNodeParameter('options.timeZone', i, '', {
                            extractValue: true,
                        });
                        if (nodeVersion >= 1.3) {
                            const timeMin = (0, GenericFunctions_1.dateObjectToISO)(this.getNodeParameter('timeMin', i));
                            const timeMax = (0, GenericFunctions_1.dateObjectToISO)(this.getNodeParameter('timeMax', i));
                            if (timeMin) {
                                qs.timeMin = (0, GenericFunctions_1.addTimezoneToDate)(timeMin, tz || timezone);
                            }
                            if (timeMax) {
                                qs.timeMax = (0, GenericFunctions_1.addTimezoneToDate)(timeMax, tz || timezone);
                            }
                            if (!options.recurringEventHandling || options.recurringEventHandling === 'expand') {
                                qs.singleEvents = true;
                            }
                        }
                        if (options.iCalUID) {
                            qs.iCalUID = options.iCalUID;
                        }
                        if (options.maxAttendees) {
                            qs.maxAttendees = options.maxAttendees;
                        }
                        if (options.orderBy) {
                            qs.orderBy = options.orderBy;
                        }
                        if (options.query) {
                            qs.q = options.query;
                        }
                        if (options.showDeleted) {
                            qs.showDeleted = options.showDeleted;
                        }
                        if (options.showHiddenInvitations) {
                            qs.showHiddenInvitations = options.showHiddenInvitations;
                        }
                        if (options.singleEvents) {
                            qs.singleEvents = options.singleEvents;
                        }
                        if (options.timeMax) {
                            qs.timeMax = (0, GenericFunctions_1.addTimezoneToDate)((0, GenericFunctions_1.dateObjectToISO)(options.timeMax), tz || timezone);
                        }
                        if (options.timeMin) {
                            qs.timeMin = (0, GenericFunctions_1.addTimezoneToDate)((0, GenericFunctions_1.dateObjectToISO)(options.timeMin), tz || timezone);
                        }
                        if (tz) {
                            qs.timeZone = tz;
                        }
                        if (options.updatedMin) {
                            qs.updatedMin = (0, GenericFunctions_1.addTimezoneToDate)((0, GenericFunctions_1.dateObjectToISO)(options.updatedMin), tz || timezone);
                        }
                        if (options.fields) {
                            qs.fields = options.fields;
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/calendar/v3/calendars/${calendarId}/events`, {}, qs);
                        }
                        else {
                            qs.maxResults = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events`, {}, qs);
                            responseData = responseData.items;
                        }
                        if (responseData) {
                            if (nodeVersion >= 1.3 && options.recurringEventHandling === 'next') {
                                const updatedEvents = [];
                                for (const event of responseData) {
                                    if (event.recurrence) {
                                        const eventInstances = (await (0, GenericFunctions_1.googleApiRequestWithRetries)({
                                            context: this,
                                            method: 'GET',
                                            resource: `/calendar/v3/calendars/${calendarId}/events/${event.id}/instances`,
                                            qs: {
                                                timeMin: new Date().toISOString(),
                                                maxResults: 1,
                                            },
                                            itemIndex: i,
                                        })).items || [];
                                        updatedEvents.push(eventInstances[0] || event);
                                        continue;
                                    }
                                    updatedEvents.push(event);
                                }
                                responseData = updatedEvents;
                            }
                            else if (nodeVersion >= 1.3 && options.recurringEventHandling === 'first') {
                                responseData = responseData.filter((event) => {
                                    if (qs.timeMin &&
                                        event.recurrence &&
                                        event.created &&
                                        event.created < qs.timeMin) {
                                        return false;
                                    }
                                    if (qs.timeMax &&
                                        event.recurrence &&
                                        event.created &&
                                        event.created > qs.timeMax) {
                                        return false;
                                    }
                                    return true;
                                });
                            }
                            else if (nodeVersion < 1.3) {
                                // in node version above or equal to 1.3, this would correspond to the 'expand' option,
                                // so no need to add the next occurrence as event instances returned by the API
                                responseData = (0, GenericFunctions_1.addNextOccurrence)(responseData);
                            }
                            if (!qs.timeMax &&
                                (!options.recurringEventHandling || options.recurringEventHandling === 'expand')) {
                                const suggestTrim = (0, GenericFunctions_1.eventExtendYearIntoFuture)(responseData, timezone);
                                if (suggestTrim) {
                                    hints.push({
                                        message: "Some events repeat far into the future. To return less of them, add a 'Before' date or change the 'Recurring Event Handling' option.",
                                        location: 'outputPane',
                                    });
                                }
                            }
                        }
                    }
                    //https://developers.google.com/calendar/v3/reference/events/patch
                    if (operation === 'update') {
                        const calendarId = (0, GenericFunctions_1.encodeURIComponentOnce)(this.getNodeParameter('calendar', i, '', { extractValue: true }));
                        let eventId = this.getNodeParameter('eventId', i);
                        if (nodeVersion >= 1.3) {
                            const modifyTarget = this.getNodeParameter('modifyTarget', i, 'instance');
                            if (modifyTarget === 'event') {
                                const instance = (await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events/${eventId}`, {}, qs));
                                eventId = instance.recurringEventId;
                            }
                        }
                        const useDefaultReminders = this.getNodeParameter('useDefaultReminders', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        let updateTimezone = updateFields.timezone;
                        if (nodeVersion > 1 && updateTimezone === undefined) {
                            updateTimezone = timezone;
                        }
                        if (updateFields.maxAttendees) {
                            qs.maxAttendees = updateFields.maxAttendees;
                        }
                        if (updateFields.sendNotifications) {
                            qs.sendNotifications = updateFields.sendNotifications;
                        }
                        if (updateFields.sendUpdates) {
                            qs.sendUpdates = updateFields.sendUpdates;
                        }
                        const body = {};
                        if (updateFields.start) {
                            body.start = {
                                dateTime: moment_timezone_1.default.tz(updateFields.start, updateTimezone).utc().format(),
                                timeZone: updateTimezone,
                            };
                        }
                        if (updateFields.end) {
                            body.end = {
                                dateTime: moment_timezone_1.default.tz(updateFields.end, updateTimezone).utc().format(),
                                timeZone: updateTimezone,
                            };
                        }
                        // nodeVersion < 1.2
                        if (updateFields.attendees) {
                            body.attendees = [];
                            updateFields.attendees.forEach((attendee) => {
                                body.attendees.push.apply(body.attendees, attendee
                                    .split(',')
                                    .map((a) => a.trim())
                                    .map((email) => ({ email })));
                            });
                        }
                        // nodeVersion >= 1.2
                        if (updateFields.attendeesUi) {
                            const { mode, attendees } = updateFields.attendeesUi.values;
                            body.attendees = [];
                            if (mode === 'add') {
                                const event = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/calendar/v3/calendars/${calendarId}/events/${eventId}`);
                                (event?.attendees || []).forEach((attendee) => {
                                    body.attendees?.push(attendee);
                                });
                            }
                            attendees.forEach((attendee) => {
                                body.attendees.push.apply(body.attendees, attendee
                                    .split(',')
                                    .map((a) => a.trim())
                                    .map((email) => ({ email })));
                            });
                        }
                        if (updateFields.color) {
                            body.colorId = updateFields.color;
                        }
                        if (updateFields.description) {
                            body.description = updateFields.description;
                        }
                        if (updateFields.guestsCanInviteOthers) {
                            body.guestsCanInviteOthers = updateFields.guestsCanInviteOthers;
                        }
                        if (updateFields.guestsCanModify) {
                            body.guestsCanModify = updateFields.guestsCanModify;
                        }
                        if (updateFields.guestsCanSeeOtherGuests) {
                            body.guestsCanSeeOtherGuests = updateFields.guestsCanSeeOtherGuests;
                        }
                        if (updateFields.id) {
                            body.id = updateFields.id;
                        }
                        if (updateFields.location) {
                            body.location = updateFields.location;
                        }
                        if (updateFields.summary) {
                            body.summary = updateFields.summary;
                        }
                        if (updateFields.showMeAs) {
                            body.transparency = updateFields.showMeAs;
                        }
                        if (updateFields.visibility) {
                            body.visibility = updateFields.visibility;
                        }
                        if (!useDefaultReminders) {
                            const reminders = this.getNodeParameter('remindersUi', i)
                                .remindersValues;
                            body.reminders = {
                                useDefault: false,
                            };
                            if (reminders) {
                                body.reminders.overrides = reminders;
                            }
                        }
                        if (updateFields.allday === 'yes' && updateFields.start && updateFields.end) {
                            body.start = {
                                date: updateTimezone
                                    ? moment_timezone_1.default.tz(updateFields.start, updateTimezone).utc(true).format('YYYY-MM-DD')
                                    : moment_timezone_1.default.tz(updateFields.start, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                            };
                            body.end = {
                                date: updateTimezone
                                    ? moment_timezone_1.default.tz(updateFields.end, updateTimezone).utc(true).format('YYYY-MM-DD')
                                    : moment_timezone_1.default.tz(updateFields.end, moment_timezone_1.default.tz.guess()).utc(true).format('YYYY-MM-DD'),
                            };
                        }
                        //example: RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=10;UNTIL=20110701T170000Z
                        //https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
                        body.recurrence = [];
                        if (updateFields.rrule) {
                            body.recurrence = [`RRULE:${updateFields.rrule}`];
                        }
                        else {
                            if (updateFields.repeatHowManyTimes && updateFields.repeatUntil) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), "You can set either 'Repeat How Many Times' or 'Repeat Until' but not both", { itemIndex: i });
                            }
                            if (updateFields.repeatFrecuency) {
                                body.recurrence?.push(`FREQ=${updateFields.repeatFrecuency.toUpperCase()};`);
                            }
                            if (updateFields.repeatHowManyTimes) {
                                body.recurrence?.push(`COUNT=${updateFields.repeatHowManyTimes};`);
                            }
                            if (updateFields.repeatUntil) {
                                const repeatUntil = (0, moment_timezone_1.default)(updateFields.repeatUntil)
                                    .utc()
                                    .format('YYYYMMDDTHHmmss');
                                body.recurrence?.push(`UNTIL=${repeatUntil}Z`);
                            }
                            if (body.recurrence.length !== 0) {
                                body.recurrence = [`RRULE:${body.recurrence.join('')}`];
                            }
                            else {
                                delete body.recurrence;
                            }
                        }
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'PATCH', `/calendar/v3/calendars/${calendarId}/events/${eventId}`, body, qs);
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (!this.continueOnFail()) {
                    throw error;
                }
                else {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
            }
        }
        const keysPriorityList = [
            'id',
            'summary',
            'start',
            'end',
            'attendees',
            'creator',
            'organizer',
            'description',
            'location',
            'created',
            'updated',
        ];
        let nodeExecutionData = returnData;
        if (nodeVersion >= 1.3) {
            nodeExecutionData = (0, utilities_1.sortItemKeysByPriorityList)(returnData, keysPriorityList);
        }
        if (hints.length) {
            this.addExecutionHints(...hints);
        }
        return [nodeExecutionData];
    }
}
exports.GoogleCalendar = GoogleCalendar;
//# sourceMappingURL=GoogleCalendar.node.js.map
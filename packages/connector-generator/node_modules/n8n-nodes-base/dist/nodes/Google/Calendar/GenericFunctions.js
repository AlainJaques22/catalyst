"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventExtendYearIntoFuture = exports.TIMEZONE_VALIDATION_REGEX = void 0;
exports.googleApiRequest = googleApiRequest;
exports.googleApiRequestAllItems = googleApiRequestAllItems;
exports.encodeURIComponentOnce = encodeURIComponentOnce;
exports.getCalendars = getCalendars;
exports.getTimezones = getTimezones;
exports.addNextOccurrence = addNextOccurrence;
exports.addTimezoneToDate = addTimezoneToDate;
exports.googleApiRequestWithRetries = googleApiRequestWithRetries;
exports.dateObjectToISO = dateObjectToISO;
const luxon_1 = require("luxon");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const rrule_1 = require("rrule");
async function googleApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `https://www.googleapis.com${resource}`,
        json: true,
    };
    try {
        if (Object.keys(headers).length !== 0) {
            options.headers = Object.assign({}, options.headers, headers);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.requestOAuth2.call(this, 'googleCalendarOAuth2Api', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.maxResults = 100;
    do {
        responseData = await googleApiRequest.call(this, method, endpoint, body, query);
        query.pageToken = responseData.nextPageToken;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.nextPageToken !== undefined && responseData.nextPageToken !== '');
    return returnData;
}
function encodeURIComponentOnce(uri) {
    // load options used to save encoded uri strings
    return encodeURIComponent(decodeURIComponent(uri));
}
async function getCalendars(filter) {
    const calendars = (await googleApiRequestAllItems.call(this, 'items', 'GET', '/calendar/v3/users/me/calendarList'));
    const results = calendars
        .map((c) => ({
        name: c.summary,
        value: c.id,
    }))
        .filter((c) => !filter ||
        c.name.toLowerCase().includes(filter.toLowerCase()) ||
        c.value?.toString() === filter)
        .sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        return 0;
    });
    return { results };
}
exports.TIMEZONE_VALIDATION_REGEX = `(${moment_timezone_1.default.tz
    .names()
    .map((t) => t.replace('+', '\\+'))
    .join('|')})[ \t]*`;
async function getTimezones(filter) {
    const results = moment_timezone_1.default.tz
        .names()
        .map((timezone) => ({
        name: timezone,
        value: timezone,
    }))
        .filter((c) => !filter ||
        c.name.toLowerCase().includes(filter.toLowerCase()) ||
        c.value?.toString() === filter);
    return { results };
}
function addNextOccurrence(items) {
    for (const item of items) {
        if (item.recurrence) {
            let eventRecurrence;
            try {
                eventRecurrence = item.recurrence.find((r) => r.toUpperCase().startsWith('RRULE'));
                if (!eventRecurrence)
                    continue;
                const start = (0, moment_timezone_1.default)(item.start.dateTime || item.end.date).utc();
                const end = (0, moment_timezone_1.default)(item.end.dateTime || item.end.date).utc();
                const rruleWithStartDate = `DTSTART:${start.format('YYYYMMDDTHHmmss')}Z\n${eventRecurrence}`;
                const rrule = rrule_1.RRule.fromString(rruleWithStartDate);
                const until = rrule.options?.until;
                const now = (0, moment_timezone_1.default)().utc();
                if (until && (0, moment_timezone_1.default)(until).isBefore(now)) {
                    continue;
                }
                const nextDate = rrule.after(now.toDate(), false);
                if (nextDate) {
                    const nextStart = (0, moment_timezone_1.default)(nextDate);
                    const duration = moment_timezone_1.default.duration((0, moment_timezone_1.default)(end).diff((0, moment_timezone_1.default)(start)));
                    const nextEnd = (0, moment_timezone_1.default)(nextStart).add(duration);
                    item.nextOccurrence = {
                        start: {
                            dateTime: nextStart.format(),
                            timeZone: item.start.timeZone,
                        },
                        end: {
                            dateTime: nextEnd.format(),
                            timeZone: item.end.timeZone,
                        },
                    };
                }
            }
            catch (error) {
                console.log(`Error adding next occurrence ${eventRecurrence}`);
            }
        }
    }
    return items;
}
const hasTimezone = (date) => date.endsWith('Z') || /\+\d{2}:\d{2}$/.test(date);
function addTimezoneToDate(date, timezone) {
    if (hasTimezone(date))
        return date;
    return moment_timezone_1.default.tz(date, timezone).utc().format();
}
async function requestWithRetries(node, requestFn, retryCount = 0, maxRetries = 10, itemIndex = 0) {
    try {
        return await requestFn();
    }
    catch (error) {
        if (!(error instanceof n8n_workflow_1.NodeApiError)) {
            throw new n8n_workflow_1.NodeOperationError(node, error.message, { itemIndex });
        }
        if (retryCount >= maxRetries)
            throw error;
        if (error.httpCode === '403' || error.httpCode === '429') {
            const delay = 1000 * Math.pow(2, retryCount);
            console.log(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${retryCount + 1})`);
            await (0, n8n_workflow_1.sleep)(delay);
            return await requestWithRetries(node, requestFn, retryCount + 1, maxRetries, itemIndex);
        }
        throw error;
    }
}
async function googleApiRequestWithRetries({ context, method, resource, body = {}, qs = {}, uri, headers = {}, itemIndex = 0, }) {
    const requestFn = async () => {
        return await googleApiRequest.call(context, method, resource, body, qs, uri, headers);
    };
    const retryCount = 0;
    const maxRetries = 10;
    return await requestWithRetries(context.getNode(), requestFn, retryCount, maxRetries, itemIndex);
}
const eventExtendYearIntoFuture = (data, timezone, currentYear) => {
    const thisYear = currentYear || (0, moment_timezone_1.default)().tz(timezone).year();
    return data.some((event) => {
        if (!event.recurringEventId)
            return false;
        const eventStart = event.start.dateTime || event.start.date;
        const eventDateTime = (0, moment_timezone_1.default)(eventStart).tz(timezone);
        if (!eventDateTime.isValid())
            return false;
        const targetYear = eventDateTime.year();
        if (targetYear - thisYear >= 1) {
            return true;
        }
        else {
            return false;
        }
    });
};
exports.eventExtendYearIntoFuture = eventExtendYearIntoFuture;
function dateObjectToISO(date) {
    if (date instanceof luxon_1.DateTime)
        return date.toISO();
    if (date instanceof Date)
        return date.toISOString();
    return date;
}
//# sourceMappingURL=GenericFunctions.js.map
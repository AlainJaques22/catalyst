"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighLevelV2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const CalendarDescription_1 = require("./description/CalendarDescription");
const ContactDescription_1 = require("./description/ContactDescription");
const OpportunityDescription_1 = require("./description/OpportunityDescription");
const TaskDescription_1 = require("./description/TaskDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const resources = [
    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'Contact',
                value: 'contact',
            },
            {
                name: 'Opportunity',
                value: 'opportunity',
            },
            {
                name: 'Task',
                value: 'task',
            },
            {
                name: 'Calendar',
                value: 'calendar',
            },
        ],
        default: 'contact',
        required: true,
    },
];
const versionDescription = {
    displayName: 'HighLevel',
    name: 'highLevel',
    icon: 'file:highLevel.svg',
    group: ['transform'],
    version: 2,
    description: 'Consume HighLevel API v2',
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    defaults: {
        name: 'HighLevel',
    },
    usableAsTool: true,
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'highLevelOAuth2Api',
            required: true,
        },
    ],
    requestDefaults: {
        baseURL: 'https://services.leadconnectorhq.com',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Version: '2021-07-28',
        },
    },
    requestOperations: {
        pagination: GenericFunctions_1.highLevelApiPagination,
    },
    properties: [
        ...resources,
        ...ContactDescription_1.contactOperations,
        ...ContactDescription_1.contactNotes,
        ...ContactDescription_1.contactFields,
        ...OpportunityDescription_1.opportunityOperations,
        ...OpportunityDescription_1.opportunityFields,
        ...TaskDescription_1.taskOperations,
        ...TaskDescription_1.taskFields,
        ...CalendarDescription_1.calendarOperations,
        ...CalendarDescription_1.calendarFields,
    ],
};
class HighLevelV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }
    methods = {
        loadOptions: {
            getPipelines: GenericFunctions_1.getPipelines,
            getContacts: GenericFunctions_1.getContacts,
            getPipelineStages: GenericFunctions_1.getPipelineStages,
            getUsers: GenericFunctions_1.getUsers,
        },
        listSearch: {
            async searchCustomFields(filter) {
                const { locationId } = (await this.getCredentials('highLevelOAuth2Api'))?.oauthTokenData ?? {};
                const responseData = (await this.helpers.httpRequestWithAuthentication.call(this, 'highLevelOAuth2Api', {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    url: `https://services.leadconnectorhq.com/locations/${locationId}/customFields?model=contact`,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Version: '2021-07-28',
                    },
                }));
                const customFields = responseData.customFields;
                const results = customFields
                    .map((a) => ({
                    name: a.name,
                    value: a.id,
                }))
                    .filter((a) => !filter || a.name.toLowerCase().includes(filter.toLowerCase()))
                    .sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase())
                        return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase())
                        return 1;
                    return 0;
                });
                return { results };
            },
            async searchTimezones(filter) {
                const { locationId } = (await this.getCredentials('highLevelOAuth2Api'))?.oauthTokenData ?? {};
                const responseData = (await this.helpers.httpRequestWithAuthentication.call(this, 'highLevelOAuth2Api', {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    url: `https://services.leadconnectorhq.com/locations/${locationId}/timezones`,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Version: '2021-07-28',
                    },
                }));
                const timezones = responseData.timeZones;
                const results = timezones
                    .map((zone) => ({
                    name: zone.trim(),
                    value: zone.trim(),
                }))
                    .filter((zone) => !filter || zone.name.toLowerCase().includes(filter.toLowerCase()))
                    .sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase())
                        return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase())
                        return 1;
                    return 0;
                });
                return { results };
            },
        },
    };
}
exports.HighLevelV2 = HighLevelV2;
//# sourceMappingURL=HighLevelV2.node.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighLevelV1 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
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
    version: 1,
    description: 'Consume HighLevel API v1',
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    defaults: {
        name: 'HighLevel',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'highLevelApi',
            required: true,
        },
    ],
    requestDefaults: {
        baseURL: 'https://rest.gohighlevel.com/v1',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
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
    ],
};
class HighLevelV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }
    methods = {
        loadOptions: {
            getPipelineStages: GenericFunctions_1.getPipelineStages,
            getUsers: GenericFunctions_1.getUsers,
            getTimezones: GenericFunctions_1.getTimezones,
        },
    };
}
exports.HighLevelV1 = HighLevelV1;
//# sourceMappingURL=HighLevelV1.node.js.map
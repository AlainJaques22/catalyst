"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const luxon_1 = require("luxon");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.groupRLC,
    descriptions_1.planRLC,
    descriptions_1.bucketRLC,
    {
        displayName: 'Title',
        name: 'title',
        required: true,
        type: 'string',
        default: '',
        placeholder: 'e.g. new task',
        description: 'Title of the task',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        default: {},
        placeholder: 'Add option',
        options: [
            {
                ...descriptions_1.memberRLC,
                displayName: 'Assigned To',
                name: 'assignedTo',
                description: 'Who the task should be assigned to',
                typeOptions: {
                    loadOptionsDependsOn: ['groupId.balue'],
                },
            },
            {
                displayName: 'Due Date Time',
                name: 'dueDateTime',
                type: 'string',
                validateType: 'dateTime',
                default: '',
                description: 'Date and time at which the task is due. The Timestamp type represents date and time information using ISO 8601 format and is always in UTC time.',
            },
            {
                displayName: 'Percent Complete',
                name: 'percentComplete',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                    maxValue: 100,
                },
                default: 0,
                placeholder: 'e.g. 75',
                description: 'Percentage of task completion. When set to 100, the task is considered completed.',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['task'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/planner-post-tasks?view=graph-rest-1.0&tabs=http
    const planId = this.getNodeParameter('planId', i, '', { extractValue: true });
    const bucketId = this.getNodeParameter('bucketId', i, '', { extractValue: true });
    const title = this.getNodeParameter('title', i);
    const options = this.getNodeParameter('options', i);
    const body = {
        planId,
        bucketId,
        title,
    };
    if (options.assignedTo) {
        options.assignedTo = this.getNodeParameter('options.assignedTo', i, '', {
            extractValue: true,
        });
    }
    if (options.dueDateTime && options.dueDateTime instanceof luxon_1.DateTime) {
        options.dueDateTime = options.dueDateTime.toISO();
    }
    Object.assign(body, options);
    if (body.assignedTo) {
        body.assignments = {
            [body.assignedTo]: {
                '@odata.type': 'microsoft.graph.plannerAssignment',
                orderHint: ' !',
            },
        };
        delete body.assignedTo;
    }
    return await transport_1.microsoftApiRequest.call(this, 'POST', '/v1.0/planner/tasks', body);
}
//# sourceMappingURL=create.operation.js.map
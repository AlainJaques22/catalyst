"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const luxon_1 = require("luxon");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    {
        displayName: 'Task ID',
        name: 'taskId',
        required: true,
        type: 'string',
        default: '',
        placeholder: 'e.g. h3ufgLvXPkSRzYm-zO5cY5gANtBQ',
        description: 'The ID of the task to update',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        default: {},
        placeholder: 'Add Field',
        options: [
            {
                ...descriptions_1.memberRLC,
                displayName: 'Assigned To',
                name: 'assignedTo',
                description: 'Who the task should be assigned to',
                hint: "Select 'Team' from options first",
                required: false,
                typeOptions: {
                    loadOptionsDependsOn: ['updateFields.groupId.value'],
                },
            },
            {
                ...descriptions_1.bucketRLC,
                required: false,
                typeOptions: {
                    loadOptionsDependsOn: ['updateFields.planId.value'],
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
                ...descriptions_1.groupRLC,
                required: false,
                typeOptions: {
                    loadOptionsDependsOn: ['/groupSource'],
                },
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
            {
                ...descriptions_1.planRLC,
                required: false,
                hint: "Select 'Team' from options first",
                typeOptions: {
                    loadOptionsDependsOn: ['updateFields.groupId.value'],
                },
            },
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: '',
                placeholder: 'e.g. my task',
                description: 'Title of the task',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['task'],
        operation: ['update'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/plannertask-update?view=graph-rest-1.0&tabs=http
    const taskId = this.getNodeParameter('taskId', i, '', { extractValue: true });
    const updateFields = this.getNodeParameter('updateFields', i);
    for (const key of Object.keys(updateFields)) {
        if (key === 'groupId') {
            // tasks are assigned to a plan and bucket, group is used for filtering
            delete updateFields.groupId;
            continue;
        }
        if (key === 'assignedTo') {
            const assignedTo = this.getNodeParameter('updateFields.assignedTo', i, '', {
                extractValue: true,
            });
            updateFields.assignments = {
                [assignedTo]: {
                    '@odata.type': 'microsoft.graph.plannerAssignment',
                    orderHint: ' !',
                },
            };
            delete updateFields.assignedTo;
            continue;
        }
        if (['bucketId', 'planId'].includes(key)) {
            updateFields[key] = this.getNodeParameter(`updateFields.${key}`, i, '', {
                extractValue: true,
            });
        }
        if (key === 'dueDateTime' && updateFields.dueDateTime instanceof luxon_1.DateTime) {
            updateFields.dueDateTime = updateFields.dueDateTime.toISO();
        }
    }
    const body = {};
    Object.assign(body, updateFields);
    const task = await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/planner/tasks/${taskId}`);
    await transport_1.microsoftApiRequest.call(this, 'PATCH', `/v1.0/planner/tasks/${taskId}`, body, {}, undefined, { 'If-Match': task['@odata.etag'] });
    return { success: true };
}
//# sourceMappingURL=update.operation.js.map
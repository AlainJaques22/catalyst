"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const descriptions_1 = require("../../../../../../utils/descriptions");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_2 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    {
        displayName: 'Tasks For',
        name: 'tasksFor',
        default: 'member',
        required: true,
        type: 'options',
        description: 'Whether to retrieve the tasks for a user or for a plan',
        options: [
            {
                name: 'Group Member',
                value: 'member',
                description: 'Tasks assigned to group member',
            },
            {
                name: 'Plan',
                value: 'plan',
                description: 'Tasks in group plan',
            },
        ],
    },
    descriptions_2.groupRLC,
    {
        ...descriptions_2.planRLC,
        displayOptions: {
            show: {
                tasksFor: ['plan'],
            },
        },
    },
    ...descriptions_1.returnAllOrLimit,
];
const displayOptions = {
    show: {
        resource: ['task'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const tasksFor = this.getNodeParameter('tasksFor', i);
    const returnAll = this.getNodeParameter('returnAll', i);
    if (tasksFor === 'member') {
        //https://docs.microsoft.com/en-us/graph/api/planneruser-list-tasks?view=graph-rest-1.0&tabs=http
        const memberId = (await transport_1.microsoftApiRequest.call(this, 'GET', '/v1.0/me'))
            .id;
        if (returnAll) {
            return await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/v1.0/users/${memberId}/planner/tasks`);
        }
        else {
            const limit = this.getNodeParameter('limit', i);
            const responseData = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/v1.0/users/${memberId}/planner/tasks`, {});
            return responseData.splice(0, limit);
        }
    }
    else {
        //https://docs.microsoft.com/en-us/graph/api/plannerplan-list-tasks?view=graph-rest-1.0&tabs=http
        const planId = this.getNodeParameter('planId', i, '', { extractValue: true });
        if (returnAll) {
            return await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/v1.0/planner/plans/${planId}/tasks`);
        }
        else {
            const limit = this.getNodeParameter('limit', i);
            const responseData = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/v1.0/planner/plans/${planId}/tasks`, {});
            return responseData.splice(0, limit);
        }
    }
}
//# sourceMappingURL=getAll.operation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const transport_1 = require("../../transport");
const properties = [
    {
        displayName: 'Task ID',
        name: 'taskId',
        required: true,
        type: 'string',
        placeholder: 'e.g. h3ufgLvXPkSRzYm-zO5cY5gANtBQ',
        description: 'The ID of the task to delete',
        default: '',
    },
];
const displayOptions = {
    show: {
        resource: ['task'],
        operation: ['deleteTask'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/plannertask-delete?view=graph-rest-1.0&tabs=http
    const taskId = this.getNodeParameter('taskId', i);
    const task = await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/planner/tasks/${taskId}`);
    await transport_1.microsoftApiRequest.call(this, 'DELETE', `/v1.0/planner/tasks/${taskId}`, {}, {}, undefined, { 'If-Match': task['@odata.etag'] });
    return { success: true };
}
//# sourceMappingURL=deleteTask.operation.js.map
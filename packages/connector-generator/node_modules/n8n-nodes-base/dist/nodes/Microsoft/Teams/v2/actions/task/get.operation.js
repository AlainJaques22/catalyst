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
        description: 'The ID of the task to retrieve',
        placeholder: 'e.g. h3ufgLvXPkSRzYm-zO5cY5gANtBQ',
        default: '',
    },
];
const displayOptions = {
    show: {
        resource: ['task'],
        operation: ['get'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/plannertask-get?view=graph-rest-1.0&tabs=http
    const taskId = this.getNodeParameter('taskId', i);
    return await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/planner/tasks/${taskId}`);
}
//# sourceMappingURL=get.operation.js.map
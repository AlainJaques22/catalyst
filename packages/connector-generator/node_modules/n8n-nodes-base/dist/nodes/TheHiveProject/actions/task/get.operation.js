"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.taskRLC];
const displayOptions = {
    show: {
        resource: ['task'],
        operation: ['get'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    let responseData = [];
    const taskId = this.getNodeParameter('taskId', i, '', { extractValue: true });
    const qs = {};
    const body = {
        query: [
            {
                _name: 'getTask',
                idOrName: taskId,
            },
        ],
    };
    qs.name = `get-task-${taskId}`;
    responseData = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body, qs);
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=get.operation.js.map
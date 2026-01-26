"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.logRLC];
const displayOptions = {
    show: {
        resource: ['log'],
        operation: ['deleteLog'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const logId = this.getNodeParameter('logId', i, '', { extractValue: true });
    await transport_1.theHiveApiRequest.call(this, 'DELETE', `/v1/log/${logId}`);
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)({ success: true }), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=deleteLog.operation.js.map
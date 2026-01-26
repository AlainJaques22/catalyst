"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
exports.properties = [descriptions_1.draftRLC];
const displayOptions = {
    show: {
        resource: ['draft'],
        operation: ['delete'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    const draftId = this.getNodeParameter('draftId', index, undefined, {
        extractValue: true,
    });
    await transport_1.microsoftApiRequest.call(this, 'DELETE', `/messages/${draftId}`);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ success: true }), { itemData: { item: index } });
    return executionData;
}
//# sourceMappingURL=delete.operation.js.map
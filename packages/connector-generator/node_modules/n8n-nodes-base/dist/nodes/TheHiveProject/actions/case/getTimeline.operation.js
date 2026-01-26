"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.caseRLC];
const displayOptions = {
    show: {
        resource: ['case'],
        operation: ['getTimeline'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    let responseData = [];
    const caseId = this.getNodeParameter('caseId', i, '', { extractValue: true });
    responseData = await transport_1.theHiveApiRequest.call(this, 'GET', `/v1/case/${caseId}/timeline`);
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=getTimeline.operation.js.map
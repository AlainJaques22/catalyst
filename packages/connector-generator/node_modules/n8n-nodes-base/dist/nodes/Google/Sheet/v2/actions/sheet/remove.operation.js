"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const transport_1 = require("../../transport");
async function execute(_sheet, sheetName) {
    const returnData = [];
    const items = this.getInputData();
    for (let i = 0; i < items.length; i++) {
        const [spreadsheetId, sheetWithinDocument] = sheetName.split('||');
        const requests = [
            {
                deleteSheet: {
                    sheetId: sheetWithinDocument,
                },
            },
        ];
        const responseData = await transport_1.apiRequest.call(this, 'POST', `/v4/spreadsheets/${spreadsheetId}:batchUpdate`, { requests });
        delete responseData.replies;
        const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), { itemData: { item: i } });
        returnData.push(...executionData);
    }
    return returnData;
}
//# sourceMappingURL=remove.operation.js.map
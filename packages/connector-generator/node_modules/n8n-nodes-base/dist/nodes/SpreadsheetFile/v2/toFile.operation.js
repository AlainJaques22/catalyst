"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const binary_1 = require("../../../utils/binary");
const utilities_1 = require("../../../utils/utilities");
const description_1 = require("../description");
exports.description = [...description_1.toFileProperties, description_1.toFileOptions];
async function execute(items) {
    const returnData = [];
    const pairedItem = (0, utilities_1.generatePairedItemData)(items.length);
    try {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0);
        const fileFormat = this.getNodeParameter('fileFormat', 0);
        const options = this.getNodeParameter('options', 0, {});
        const binaryData = await binary_1.convertJsonToSpreadsheetBinary.call(this, items, fileFormat, options);
        const newItem = {
            json: {},
            binary: {
                [binaryPropertyName]: binaryData,
            },
            pairedItem,
        };
        returnData.push(newItem);
    }
    catch (error) {
        if (this.continueOnFail()) {
            returnData.push({
                json: {
                    error: error.message,
                },
                pairedItem,
            });
        }
        else {
            throw error;
        }
    }
    return returnData;
}
//# sourceMappingURL=toFile.operation.js.map
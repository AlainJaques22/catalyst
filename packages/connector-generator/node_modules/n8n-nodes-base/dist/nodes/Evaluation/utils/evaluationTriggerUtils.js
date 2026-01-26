"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheet = getSheet;
exports.getGoogleSheet = getGoogleSheet;
exports.getFilteredResults = getFilteredResults;
exports.getNumberOfRowsLeftFiltered = getNumberOfRowsLeftFiltered;
exports.getResults = getResults;
exports.getRowsLeft = getRowsLeft;
const readOperation_1 = require("../../Google/Sheet/v2/actions/utils/readOperation");
const GoogleSheet_1 = require("../../Google/Sheet/v2/helpers/GoogleSheet");
const GoogleSheets_utils_1 = require("../../Google/Sheet/v2/helpers/GoogleSheets.utils");
async function getSheet(googleSheet) {
    const sheetWithinDocument = this.getNodeParameter('sheetName', 0, undefined, {
        extractValue: true,
    });
    const { mode: sheetMode } = this.getNodeParameter('sheetName', 0);
    return await googleSheet.spreadsheetGetSheet(this.getNode(), sheetMode, sheetWithinDocument);
}
function getGoogleSheet() {
    const { mode, value } = this.getNodeParameter('documentId', 0);
    const spreadsheetId = (0, GoogleSheets_utils_1.getSpreadsheetId)(this.getNode(), mode, value);
    const googleSheet = new GoogleSheet_1.GoogleSheet(spreadsheetId, this);
    return googleSheet;
}
async function getFilteredResults(operationResult, googleSheet, result, startingRow, endingRow) {
    const sheetName = result.title;
    operationResult = await readOperation_1.readSheet.call(this, googleSheet, sheetName, 0, operationResult, this.getNode().typeVersion, [], undefined, {
        rangeDefinition: 'specifyRange',
        headerRow: 1,
        firstDataRow: startingRow,
        includeHeadersWithEmptyCells: true,
    });
    return operationResult.filter((row) => row?.json?.row_number <= endingRow);
}
async function getNumberOfRowsLeftFiltered(googleSheet, sheetName, startingRow, endingRow) {
    const remainderSheet = await readOperation_1.readSheet.call(this, googleSheet, sheetName, 0, [], this.getNode().typeVersion, [], undefined, {
        rangeDefinition: 'specifyRange',
        headerRow: 1,
        firstDataRow: startingRow,
    });
    return remainderSheet.filter((row) => row?.json?.row_number <= endingRow).length;
}
async function getResults(operationResult, googleSheet, result, rangeOptions) {
    const sheetName = result.title;
    operationResult = await readOperation_1.readSheet.call(this, googleSheet, sheetName, 0, operationResult, this.getNode().typeVersion, [], undefined, { ...rangeOptions, includeHeadersWithEmptyCells: true });
    return operationResult;
}
async function getRowsLeft(googleSheet, sheetName, rangeString) {
    const remainderSheet = await readOperation_1.readSheet.call(this, googleSheet, sheetName, 0, [], this.getNode().typeVersion, [], rangeString);
    return remainderSheet.length;
}
//# sourceMappingURL=evaluationTriggerUtils.js.map
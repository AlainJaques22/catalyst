"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheets = getSheets;
exports.getSheetHeaderRow = getSheetHeaderRow;
exports.getSheetHeaderRowAndAddColumn = getSheetHeaderRowAndAddColumn;
exports.getSheetHeaderRowWithGeneratedColumnNames = getSheetHeaderRowWithGeneratedColumnNames;
exports.getSheetHeaderRowAndSkipEmpty = getSheetHeaderRowAndSkipEmpty;
const n8n_workflow_1 = require("n8n-workflow");
const GoogleSheet_1 = require("../helpers/GoogleSheet");
const GoogleSheets_utils_1 = require("../helpers/GoogleSheets.utils");
async function getSheets() {
    const documentId = this.getNodeParameter('documentId', 0);
    if (!documentId)
        return [];
    const { mode, value } = documentId;
    const spreadsheetId = (0, GoogleSheets_utils_1.getSpreadsheetId)(this.getNode(), mode, value);
    const sheet = new GoogleSheet_1.GoogleSheet(spreadsheetId, this);
    const responseData = await sheet.spreadsheetGetSheets();
    if (responseData === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const returnData = [];
    for (const entry of responseData.sheets) {
        if (entry.properties.sheetType !== 'GRID') {
            continue;
        }
        returnData.push({
            name: entry.properties.title,
            value: entry.properties.sheetId,
        });
    }
    return returnData;
}
async function getSheetHeaderRow() {
    const documentId = this.getNodeParameter('documentId', 0);
    if (!documentId)
        return [];
    const { mode, value } = documentId;
    const spreadsheetId = (0, GoogleSheets_utils_1.getSpreadsheetId)(this.getNode(), mode, value);
    const sheet = new GoogleSheet_1.GoogleSheet(spreadsheetId, this);
    const sheetWithinDocument = this.getNodeParameter('sheetName', undefined, {
        extractValue: true,
    });
    const { mode: sheetMode } = this.getNodeParameter('sheetName', 0);
    const { title: sheetName } = await sheet.spreadsheetGetSheet(this.getNode(), sheetMode, sheetWithinDocument);
    const sheetData = await sheet.getData(`${sheetName}!1:1`, 'FORMATTED_VALUE');
    if (sheetData === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const columns = sheet.testFilter(sheetData, 0, 0);
    const returnData = [];
    for (const column of columns) {
        returnData.push({
            name: column,
            value: column,
        });
    }
    return returnData;
}
async function getSheetHeaderRowAndAddColumn() {
    const returnData = await getSheetHeaderRow.call(this);
    returnData.push({
        name: 'New column ...',
        value: 'newColumn',
    });
    const columnToMatchOn = this.getNodeParameter('columnToMatchOn', 0);
    return returnData.filter((column) => column.value !== columnToMatchOn);
}
async function getSheetHeaderRowWithGeneratedColumnNames() {
    const returnData = await getSheetHeaderRow.call(this);
    return returnData.map((column, i) => {
        if (column.value !== '')
            return column;
        const indexBasedValue = `col_${i + 1}`;
        return {
            name: indexBasedValue,
            value: indexBasedValue,
        };
    });
}
async function getSheetHeaderRowAndSkipEmpty() {
    const returnData = await getSheetHeaderRow.call(this);
    return returnData.filter((column) => column.value);
}
//# sourceMappingURL=loadOptions.js.map
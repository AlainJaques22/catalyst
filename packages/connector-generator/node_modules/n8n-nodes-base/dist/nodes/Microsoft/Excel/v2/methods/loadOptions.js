"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorksheetColumnRow = getWorksheetColumnRow;
exports.getWorksheetColumnRowSkipColumnToMatchOn = getWorksheetColumnRowSkipColumnToMatchOn;
exports.getTableColumns = getTableColumns;
const transport_1 = require("../transport");
const utils_1 = require("../helpers/utils");
async function getWorksheetColumnRow() {
    const workbookId = this.getNodeParameter('workbook', undefined, {
        extractValue: true,
    });
    const worksheetId = this.getNodeParameter('worksheet', undefined, {
        extractValue: true,
    });
    let range = this.getNodeParameter('range', '');
    let columns = [];
    if (range === '') {
        const worksheetData = await transport_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/usedRange`, undefined, { select: 'values' });
        columns = worksheetData.values[0];
    }
    else {
        const { cellFrom, cellTo } = (0, utils_1.parseAddress)(range);
        range = `${cellFrom.value}:${cellTo.column}${cellFrom.row}`;
        const worksheetData = await transport_1.microsoftApiRequest.call(this, 'PATCH', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/range(address='${range}')`, { select: 'values' });
        columns = worksheetData.values[0];
    }
    const returnData = [];
    for (const column of columns) {
        returnData.push({
            name: column,
            value: column,
        });
    }
    return returnData;
}
async function getWorksheetColumnRowSkipColumnToMatchOn() {
    const returnData = await getWorksheetColumnRow.call(this);
    const columnToMatchOn = this.getNodeParameter('columnToMatchOn', 0);
    return returnData.filter((column) => column.value !== columnToMatchOn);
}
async function getTableColumns() {
    const workbookId = this.getNodeParameter('workbook', undefined, {
        extractValue: true,
    });
    const worksheetId = this.getNodeParameter('worksheet', undefined, {
        extractValue: true,
    });
    const tableId = this.getNodeParameter('table', undefined, {
        extractValue: true,
    });
    const response = await transport_1.microsoftApiRequest.call(this, 'GET', `/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/tables/${tableId}/columns`, {});
    return response.value.map((column) => ({
        name: column.name,
        value: column.name,
    }));
}
//# sourceMappingURL=loadOptions.js.map
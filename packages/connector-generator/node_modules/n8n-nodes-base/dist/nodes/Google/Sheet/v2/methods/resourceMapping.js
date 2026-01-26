"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMappingColumns = getMappingColumns;
const GoogleSheet_1 = require("../helpers/GoogleSheet");
const GoogleSheets_types_1 = require("../helpers/GoogleSheets.types");
const GoogleSheets_utils_1 = require("../helpers/GoogleSheets.utils");
async function getMappingColumns() {
    const documentId = this.getNodeParameter('documentId', 0);
    if (!documentId)
        return { fields: [] };
    const { mode, value } = documentId;
    const spreadsheetId = (0, GoogleSheets_utils_1.getSpreadsheetId)(this.getNode(), mode, value);
    const sheet = new GoogleSheet_1.GoogleSheet(spreadsheetId, this);
    const sheetWithinDocument = this.getNodeParameter('sheetName', undefined, {
        extractValue: true,
    });
    const { mode: sheetMode } = this.getNodeParameter('sheetName', 0);
    const { title: sheetName } = await sheet.spreadsheetGetSheet(this.getNode(), sheetMode, sheetWithinDocument);
    const locationDefine = this.getNodeParameter('options.locationDefine.values', 0, {});
    let columnNamesRow = 1;
    if (locationDefine.headerRow) {
        columnNamesRow = locationDefine.headerRow;
    }
    const sheetData = await sheet.getData(`${sheetName}!${columnNamesRow}:${columnNamesRow}`, 'FORMATTED_VALUE');
    const columns = sheet.testFilter(sheetData || [], 0, 0).filter((col) => col !== '');
    const fields = columns.map((col) => ({
        id: col,
        displayName: col,
        required: false,
        defaultMatch: col === 'id',
        display: true,
        type: 'string',
        canBeUsedToMatch: true,
    }));
    const operation = this.getNodeParameter('operation', 0);
    if (operation === 'update') {
        fields.push({
            id: GoogleSheets_types_1.ROW_NUMBER,
            displayName: GoogleSheets_types_1.ROW_NUMBER,
            required: false,
            defaultMatch: false,
            display: true,
            type: 'number',
            canBeUsedToMatch: true,
            readOnly: true,
            removed: true,
        });
    }
    return { fields };
}
//# sourceMappingURL=resourceMapping.js.map
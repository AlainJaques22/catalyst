"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spreadSheetsSearch = spreadSheetsSearch;
exports.sheetsSearch = sheetsSearch;
const n8n_workflow_1 = require("n8n-workflow");
const GoogleSheets_utils_1 = require("../helpers/GoogleSheets.utils");
const transport_1 = require("../transport");
async function spreadSheetsSearch(filter, paginationToken) {
    const query = [];
    if (filter) {
        query.push(`name contains '${filter.replace("'", "\\'")}'`);
    }
    query.push("mimeType = 'application/vnd.google-apps.spreadsheet'");
    const qs = {
        q: query.join(' and '),
        pageToken: paginationToken || undefined,
        fields: 'nextPageToken, files(id, name, webViewLink)',
        orderBy: 'modifiedByMeTime desc,name_natural',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
    };
    const res = await transport_1.apiRequest.call(this, 'GET', '', {}, qs, 'https://www.googleapis.com/drive/v3/files');
    return {
        results: res.files.map((sheet) => ({
            name: sheet.name,
            value: sheet.id,
            url: sheet.webViewLink,
        })),
        paginationToken: res.nextPageToken,
    };
}
async function sheetsSearch(_filter) {
    const documentId = this.getNodeParameter('documentId', 0);
    if (!documentId)
        return { results: [] };
    const { mode, value } = documentId;
    const spreadsheetId = (0, GoogleSheets_utils_1.getSpreadsheetId)(this.getNode(), mode, value);
    const query = {
        fields: 'sheets.properties',
    };
    const responseData = await transport_1.apiRequest.call(this, 'GET', `/v4/spreadsheets/${spreadsheetId}`, {}, query);
    if (responseData === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const returnData = [];
    for (const sheet of responseData.sheets) {
        if (sheet.properties.sheetType !== 'GRID') {
            continue;
        }
        returnData.push({
            name: sheet.properties.title,
            value: sheet.properties.sheetId || 'gid=0',
            url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheet.properties.sheetId}`,
        });
    }
    return { results: returnData };
}
//# sourceMappingURL=listSearch.js.map
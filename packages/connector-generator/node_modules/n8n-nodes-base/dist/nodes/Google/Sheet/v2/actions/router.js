"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const sheet = __importStar(require("./sheet/Sheet.resource"));
const spreadsheet = __importStar(require("./spreadsheet/SpreadSheet.resource"));
const GoogleSheet_1 = require("../helpers/GoogleSheet");
const GoogleSheets_utils_1 = require("../helpers/GoogleSheets.utils");
async function router() {
    let operationResult = [];
    try {
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const googleSheets = {
            resource,
            operation,
        };
        let results;
        if (googleSheets.resource === 'sheet') {
            const { mode, value } = this.getNodeParameter('documentId', 0);
            const spreadsheetId = (0, GoogleSheets_utils_1.getSpreadsheetId)(this.getNode(), mode, value);
            const googleSheet = new GoogleSheet_1.GoogleSheet(spreadsheetId, this);
            let sheetId = '';
            let sheetName = '';
            if (operation !== 'create') {
                const sheetWithinDocument = this.getNodeParameter('sheetName', 0, undefined, {
                    extractValue: true,
                });
                const { mode: sheetMode } = this.getNodeParameter('sheetName', 0);
                const result = await googleSheet.spreadsheetGetSheet(this.getNode(), sheetMode, sheetWithinDocument);
                sheetId = result.sheetId.toString();
                sheetName = result.title;
            }
            switch (operation) {
                case 'create':
                    sheetName = spreadsheetId;
                    break;
                case 'delete':
                    sheetName = sheetId;
                    break;
                case 'remove':
                    sheetName = `${spreadsheetId}||${sheetId}`;
                    break;
            }
            results = await sheet[googleSheets.operation].execute.call(this, googleSheet, sheetName, sheetId);
        }
        else if (googleSheets.resource === 'spreadsheet') {
            results = await spreadsheet[googleSheets.operation].execute.call(this);
        }
        if (results?.length) {
            operationResult = operationResult.concat(results);
        }
    }
    catch (error) {
        if (this.continueOnFail()) {
            operationResult.push({ json: this.getInputData(0)[0].json, error });
        }
        else {
            throw error;
        }
    }
    return [operationResult];
}
//# sourceMappingURL=router.js.map
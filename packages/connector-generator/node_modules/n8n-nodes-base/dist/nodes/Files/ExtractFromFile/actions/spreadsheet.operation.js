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
exports.description = exports.operations = void 0;
exports.execute = execute;
const fromFile = __importStar(require("../../../SpreadsheetFile/v2/fromFile.operation"));
exports.operations = ['csv', 'html', 'rtf', 'ods', 'xls', 'xlsx'];
exports.description = fromFile.description
    .filter((property) => property.name !== 'fileFormat')
    .map((property) => {
    const newProperty = { ...property };
    newProperty.displayOptions = {
        show: {
            operation: exports.operations,
        },
    };
    if (newProperty.name === 'options') {
        newProperty.options = newProperty.options.map((option) => {
            let newOption = option;
            if ([
                'delimiter',
                'encoding',
                'fromLine',
                'maxRowCount',
                'enableBOM',
                'relaxQuotes',
                'skipRecordsWithErrors',
            ].includes(option.name)) {
                newOption = { ...option, displayOptions: { show: { '/operation': ['csv'] } } };
            }
            if (option.name === 'sheetName') {
                newOption = {
                    ...option,
                    displayOptions: { show: { '/operation': ['ods', 'xls', 'xlsx'] } },
                    description: 'Name of the sheet to read from in the spreadsheet',
                };
            }
            if (option.name === 'range') {
                newOption = {
                    ...option,
                    displayOptions: { show: { '/operation': ['ods', 'xls', 'xlsx'] } },
                };
            }
            if (['includeEmptyCells', 'headerRow'].includes(option.name)) {
                newOption = {
                    ...option,
                    displayOptions: { show: { '/operation': ['ods', 'xls', 'xlsx', 'csv', 'html'] } },
                };
            }
            return newOption;
        });
    }
    return newProperty;
});
async function execute(items, fileFormatProperty, options) {
    const returnData = await fromFile.execute.call(this, items, fileFormatProperty, options);
    return returnData;
}
//# sourceMappingURL=spreadsheet.operation.js.map
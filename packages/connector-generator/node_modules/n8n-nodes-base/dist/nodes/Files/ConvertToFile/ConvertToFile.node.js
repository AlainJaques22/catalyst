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
exports.ConvertToFile = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const iCall = __importStar(require("./actions/iCall.operation"));
const spreadsheet = __importStar(require("./actions/spreadsheet.operation"));
const toBinary = __importStar(require("./actions/toBinary.operation"));
const toJson = __importStar(require("./actions/toJson.operation"));
const toText = __importStar(require("./actions/toText.operation"));
class ConvertToFile {
    description = {
        displayName: 'Convert to File',
        name: 'convertToFile',
        icon: { light: 'file:convertToFile.svg', dark: 'file:convertToFile.dark.svg' },
        group: ['input'],
        version: [1, 1.1],
        description: 'Convert JSON data to binary data',
        defaults: {
            name: 'Convert to File',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Convert to CSV',
                        value: 'csv',
                        action: 'Convert to CSV',
                        description: 'Transform input data into a CSV file',
                    },
                    {
                        name: 'Convert to HTML',
                        value: 'html',
                        action: 'Convert to HTML',
                        description: 'Transform input data into a table in an HTML file',
                    },
                    {
                        name: 'Convert to ICS',
                        value: 'iCal',
                        action: 'Convert to ICS',
                        description: 'Converts each input item to an ICS event file',
                    },
                    {
                        name: 'Convert to JSON',
                        value: 'toJson',
                        action: 'Convert to JSON',
                        description: 'Transform input data into a single or multiple JSON files',
                    },
                    {
                        name: 'Convert to ODS',
                        value: 'ods',
                        action: 'Convert to ODS',
                        description: 'Transform input data into an ODS file',
                    },
                    {
                        name: 'Convert to RTF',
                        value: 'rtf',
                        action: 'Convert to RTF',
                        description: 'Transform input data into a table in an RTF file',
                    },
                    {
                        name: 'Convert to Text File',
                        value: 'toText',
                        action: 'Convert to text file',
                        description: 'Transform input data string into a file',
                    },
                    {
                        name: 'Convert to XLS',
                        value: 'xls',
                        action: 'Convert to XLS',
                        description: 'Transform input data into an Excel file',
                    },
                    {
                        name: 'Convert to XLSX',
                        value: 'xlsx',
                        action: 'Convert to XLSX',
                        description: 'Transform input data into an Excel file',
                    },
                    {
                        name: 'Move Base64 String to File',
                        value: 'toBinary',
                        action: 'Move base64 string to file',
                        description: 'Convert a base64-encoded string into its original file format',
                    },
                ],
                default: 'csv',
            },
            ...spreadsheet.description,
            ...toBinary.description,
            ...toText.description,
            ...toJson.description,
            ...iCall.description,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0);
        let returnData = [];
        if (spreadsheet.operations.includes(operation)) {
            returnData = await spreadsheet.execute.call(this, items, operation);
        }
        if (operation === 'toJson') {
            returnData = await toJson.execute.call(this, items);
        }
        if (operation === 'toBinary') {
            returnData = await toBinary.execute.call(this, items);
        }
        if (operation === 'toText') {
            returnData = await toText.execute.call(this, items);
        }
        if (operation === 'iCal') {
            returnData = await iCall.execute.call(this, items);
        }
        return [returnData];
    }
}
exports.ConvertToFile = ConvertToFile;
//# sourceMappingURL=ConvertToFile.node.js.map
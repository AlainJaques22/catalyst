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
exports.ExtractFromFile = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moveTo = __importStar(require("./actions/moveTo.operation"));
const pdf = __importStar(require("./actions/pdf.operation"));
const spreadsheet = __importStar(require("./actions/spreadsheet.operation"));
class ExtractFromFile {
    // eslint-disable-next-line n8n-nodes-base/node-class-description-missing-subtitle
    description = {
        displayName: 'Extract from File',
        name: 'extractFromFile',
        icon: { light: 'file:extractFromFile.svg', dark: 'file:extractFromFile.dark.svg' },
        group: ['input'],
        version: [1, 1.1],
        description: 'Convert binary data to JSON',
        defaults: {
            name: 'Extract from File',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                options: [
                    {
                        name: 'Extract From CSV',
                        value: 'csv',
                        action: 'Extract from CSV',
                        description: 'Transform a CSV file into output items',
                    },
                    {
                        name: 'Extract From HTML',
                        value: 'html',
                        action: 'Extract from HTML',
                        description: 'Transform a table in an HTML file into output items',
                    },
                    {
                        name: 'Extract From ICS',
                        value: 'fromIcs',
                        action: 'Extract from ICS',
                        description: 'Transform a ICS file into output items',
                    },
                    {
                        name: 'Extract From JSON',
                        value: 'fromJson',
                        action: 'Extract from JSON',
                        description: 'Transform a JSON file into output items',
                    },
                    {
                        name: 'Extract From ODS',
                        value: 'ods',
                        action: 'Extract from ODS',
                        description: 'Transform an ODS file into output items',
                    },
                    {
                        name: 'Extract From PDF',
                        value: 'pdf',
                        action: 'Extract from PDF',
                        description: 'Extracts the content and metadata from a PDF file',
                    },
                    {
                        name: 'Extract From RTF',
                        value: 'rtf',
                        action: 'Extract from RTF',
                        description: 'Transform a table in an RTF file into output items',
                    },
                    {
                        name: 'Extract From Text File',
                        value: 'text',
                        action: 'Extract from text file',
                        description: 'Extracts the content of a text file',
                    },
                    {
                        name: 'Extract From XML',
                        value: 'xml',
                        action: 'Extract from XML',
                        description: 'Extracts the content of an XML file',
                    },
                    {
                        name: 'Extract From XLS',
                        value: 'xls',
                        action: 'Extract from XLS',
                        description: 'Transform an Excel file into output items',
                    },
                    {
                        name: 'Extract From XLSX',
                        value: 'xlsx',
                        action: 'Extract from XLSX',
                        description: 'Transform an Excel file into output items',
                    },
                    {
                        name: 'Move File to Base64 String',
                        value: 'binaryToPropery',
                        action: 'Move file to base64 string',
                        description: 'Convert a file into a base64-encoded string',
                    },
                ],
                default: 'csv',
            },
            ...spreadsheet.description,
            ...moveTo.description,
            ...pdf.description,
        ],
    };
    async execute() {
        const version = this.getNode().typeVersion;
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0);
        let returnData = [];
        if (spreadsheet.operations.includes(operation)) {
            returnData = await spreadsheet.execute.call(this, items, 'operation', {
                failOnCsvBufferError: version > 1,
            });
        }
        if (['binaryToPropery', 'fromJson', 'text', 'fromIcs', 'xml'].includes(operation)) {
            returnData = await moveTo.execute.call(this, items, operation);
        }
        if (operation === 'pdf') {
            returnData = await pdf.execute.call(this, items);
        }
        return [returnData];
    }
}
exports.ExtractFromFile = ExtractFromFile;
//# sourceMappingURL=ExtractFromFile.node.js.map
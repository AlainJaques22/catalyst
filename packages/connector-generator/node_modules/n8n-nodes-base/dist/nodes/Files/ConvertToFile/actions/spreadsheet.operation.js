"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = exports.operations = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const binary_1 = require("../../../../utils/binary");
const utilities_1 = require("../../../../utils/utilities");
exports.operations = ['csv', 'html', 'rtf', 'ods', 'xls', 'xlsx'];
exports.properties = [
    {
        displayName: 'Put Output File in Field',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        placeholder: 'e.g data',
        hint: 'The name of the output binary field to put the file in',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Compression',
                name: 'compression',
                type: 'boolean',
                displayOptions: {
                    show: {
                        '/operation': ['xlsx', 'ods'],
                    },
                },
                default: false,
                description: 'Whether to reduce the output file size',
            },
            {
                displayName: 'Delimiter',
                name: 'delimiter',
                type: 'string',
                displayOptions: {
                    show: {
                        '/operation': ['csv'],
                    },
                },
                default: ',',
                description: 'The character to use to separate fields',
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                description: 'Name of the output file',
            },
            {
                displayName: 'Header Row',
                name: 'headerRow',
                type: 'boolean',
                default: true,
                description: 'Whether the first row of the file contains the header names',
            },
            {
                displayName: 'Sheet Name',
                name: 'sheetName',
                type: 'string',
                displayOptions: {
                    show: {
                        '/operation': ['ods', 'xls', 'xlsx'],
                    },
                },
                default: 'Sheet',
                description: 'Name of the sheet to create in the spreadsheet',
                placeholder: 'e.g. mySheet',
            },
        ],
    },
];
const displayOptions = {
    show: {
        operation: exports.operations,
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(items, operation) {
    let returnData = [];
    const pairedItem = (0, utilities_1.generatePairedItemData)(items.length);
    try {
        const options = this.getNodeParameter('options', 0, {});
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0, 'data');
        const binaryData = await binary_1.convertJsonToSpreadsheetBinary.call(this, items, operation, options, 'File');
        const newItem = {
            json: {},
            binary: {
                [binaryPropertyName]: binaryData,
            },
            pairedItem,
        };
        returnData = [newItem];
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
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
        }
    }
    return returnData;
}
//# sourceMappingURL=spreadsheet.operation.js.map
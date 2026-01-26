"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const unset_1 = __importDefault(require("lodash/unset"));
const n8n_workflow_1 = require("n8n-workflow");
const binary_1 = require("../../../../utils/binary");
const utilities_1 = require("../../../../utils/utilities");
exports.properties = [
    {
        displayName: 'Input Binary Field',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        placeholder: 'e.g data',
        hint: 'The name of the input binary field containing the file to be extracted',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Join Pages',
                name: 'joinPages',
                type: 'boolean',
                default: true,
                description: 'Whether to join the text from all pages or return an array of text from each page',
            },
            {
                displayName: 'Keep Source',
                name: 'keepSource',
                type: 'options',
                default: 'json',
                options: [
                    {
                        name: 'JSON',
                        value: 'json',
                        description: 'Include JSON data of the input item',
                    },
                    {
                        name: 'Binary',
                        value: 'binary',
                        description: 'Include binary data of the input item',
                    },
                    {
                        name: 'Both',
                        value: 'both',
                        description: 'Include both JSON and binary data of the input item',
                    },
                ],
            },
            {
                displayName: 'Max Pages',
                name: 'maxPages',
                type: 'number',
                default: 0,
                description: 'Maximum number of pages to include',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Prowide password, if the PDF is encrypted',
            },
        ],
    },
];
const displayOptions = {
    show: {
        operation: ['pdf'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(items) {
    const returnData = [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
            const item = items[itemIndex];
            const options = this.getNodeParameter('options', itemIndex);
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
            const json = await binary_1.extractDataFromPDF.call(this, binaryPropertyName, options.password, options.maxPages, options.joinPages, itemIndex);
            const newItem = {
                json: {},
                pairedItem: { item: itemIndex },
            };
            if (options.keepSource && options.keepSource !== 'binary') {
                newItem.json = { ...(0, n8n_workflow_1.deepCopy)(item.json), ...json };
            }
            else {
                newItem.json = json;
            }
            if (options.keepSource === 'binary' || options.keepSource === 'both') {
                newItem.binary = item.binary;
            }
            else {
                // this binary data would not be included, but there also might be other binary data
                // which should be included, copy it over and unset current binary data
                newItem.binary = (0, n8n_workflow_1.deepCopy)(item.binary);
                (0, unset_1.default)(newItem.binary, binaryPropertyName);
            }
            returnData.push(newItem);
        }
        catch (error) {
            if (this.continueOnFail()) {
                returnData.push({
                    json: {
                        error: error.message,
                    },
                    pairedItem: {
                        item: itemIndex,
                    },
                });
                continue;
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex });
        }
    }
    return returnData;
}
//# sourceMappingURL=pdf.operation.js.map
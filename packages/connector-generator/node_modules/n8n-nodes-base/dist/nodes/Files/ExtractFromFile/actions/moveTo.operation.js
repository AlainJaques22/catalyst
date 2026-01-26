"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const unset_1 = __importDefault(require("lodash/unset"));
const n8n_workflow_1 = require("n8n-workflow");
const ts_ics_1 = require("ts-ics");
const descriptions_1 = require("../../../../utils/descriptions");
const utilities_1 = require("../../../../utils/utilities");
exports.properties = [
    {
        displayName: 'Input Binary Field',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        placeholder: 'e.g data',
        hint: 'The name of the input field containing the file data to be processed',
    },
    {
        displayName: 'Destination Output Field',
        name: 'destinationKey',
        type: 'string',
        default: 'data',
        required: true,
        placeholder: 'e.g data',
        description: 'The name of the output field that will contain the extracted data',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'File Encoding',
                name: 'encoding',
                type: 'options',
                options: descriptions_1.encodeDecodeOptions,
                default: 'utf8',
                description: 'Specify the encoding of the file, defaults to UTF-8',
            },
            {
                displayName: 'Strip BOM',
                name: 'stripBOM',
                displayOptions: {
                    show: {
                        encoding: ['utf8', 'cesu8', 'ucs2'],
                    },
                },
                type: 'boolean',
                default: true,
                description: 'Whether to strip the BOM (Byte Order Mark) from the file, this could help in an environment where the presence of the BOM is causing issues or inconsistencies',
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
        ],
    },
];
const displayOptions = {
    show: {
        operation: ['binaryToPropery', 'fromJson', 'text', 'fromIcs', 'xml'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(items, operation) {
    const returnData = [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
            const item = items[itemIndex];
            const options = this.getNodeParameter('options', itemIndex);
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
            const newItem = {
                json: {},
                pairedItem: { item: itemIndex },
            };
            const value = (0, get_1.default)(item.binary, binaryPropertyName);
            if (!value)
                continue;
            const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
            const encoding = options.encoding || this.helpers.detectBinaryEncoding(buffer);
            if (options.keepSource && options.keepSource !== 'binary') {
                newItem.json = (0, n8n_workflow_1.deepCopy)(item.json);
            }
            let convertedValue;
            if (operation !== 'binaryToPropery') {
                convertedValue = iconv_lite_1.default.decode(buffer, encoding, {
                    stripBOM: options.stripBOM,
                });
            }
            else {
                convertedValue = Buffer.from(buffer).toString(n8n_workflow_1.BINARY_ENCODING);
            }
            if (operation === 'fromJson') {
                if (convertedValue === '') {
                    convertedValue = {};
                }
                else {
                    convertedValue = (0, n8n_workflow_1.jsonParse)(convertedValue);
                }
            }
            if (operation === 'fromIcs') {
                convertedValue = (0, ts_ics_1.icsCalendarToObject)(convertedValue);
            }
            const destinationKey = this.getNodeParameter('destinationKey', itemIndex, '');
            (0, set_1.default)(newItem.json, destinationKey, convertedValue);
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
            let errorDescription;
            if (typeof error.message === 'string' && error.message.includes('Unexpected token')) {
                error.message = "The file selected in 'Input Binary Field' is not in JSON format";
                errorDescription =
                    "Try to change the operation or select a JSON file in 'Input Binary Field'";
            }
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
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                itemIndex,
                description: errorDescription,
            });
        }
    }
    return returnData;
}
//# sourceMappingURL=moveTo.operation.js.map
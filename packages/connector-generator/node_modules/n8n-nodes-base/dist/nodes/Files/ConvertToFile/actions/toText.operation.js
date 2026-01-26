"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const binary_1 = require("../../../../utils/binary");
const descriptions_1 = require("../../../../utils/descriptions");
const utilities_1 = require("../../../../utils/utilities");
exports.properties = [
    {
        displayName: 'Text Input Field',
        name: 'sourceProperty',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'e.g data',
        requiresDataPath: 'single',
        description: "The name of the input field that contains a string to convert to a file. Use dot-notation for deep fields (e.g. 'level1.level2.currentKey').",
    },
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
                displayName: 'Add Byte Order Mark (BOM)',
                description: 'Whether to add special marker at the start of your text file. This marker helps some programs understand how to read the file correctly.',
                name: 'addBOM',
                displayOptions: {
                    show: {
                        encoding: ['utf8', 'cesu8', 'ucs2'],
                    },
                },
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Encoding',
                name: 'encoding',
                type: 'options',
                options: descriptions_1.encodeDecodeOptions,
                default: 'utf8',
                description: 'Choose the character set to use to encode the data',
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                placeholder: 'e.g. myFile',
                description: 'Name of the output file',
            },
        ],
    },
];
const displayOptions = {
    show: {
        operation: ['toText'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(items) {
    const returnData = [];
    for (let i = 0; i < items.length; i++) {
        try {
            const options = this.getNodeParameter('options', i, {});
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data');
            const sourceProperty = this.getNodeParameter('sourceProperty', i);
            const jsonToBinaryOptions = {
                sourceKey: sourceProperty,
                fileName: options.fileName || 'file.txt',
                mimeType: 'text/plain',
                dataIsBase64: false,
                encoding: options.encoding,
                addBOM: options.addBOM,
                itemIndex: i,
            };
            const binaryData = await binary_1.createBinaryFromJson.call(this, items[i].json, jsonToBinaryOptions);
            const newItem = {
                json: {},
                binary: {
                    [binaryPropertyName]: binaryData,
                },
                pairedItem: { item: i },
            };
            returnData.push(newItem);
        }
        catch (error) {
            if (this.continueOnFail()) {
                returnData.push({
                    json: {
                        error: error.message,
                    },
                    pairedItem: {
                        item: i,
                    },
                });
                continue;
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex: i });
        }
    }
    return returnData;
}
//# sourceMappingURL=toText.operation.js.map
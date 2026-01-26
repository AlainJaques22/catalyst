"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../utils/utilities");
const utils_1 = require("../helpers/utils");
const node_fs_1 = require("node:fs");
exports.properties = [
    {
        displayName: 'File Path and Name',
        name: 'fileName',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'e.g. /data/example.jpg',
        description: 'Path and name of the file that should be written. Also include the file extension.',
    },
    {
        displayName: 'Input Binary Field',
        name: 'dataPropertyName',
        type: 'string',
        default: 'data',
        placeholder: 'e.g. data',
        required: true,
        hint: 'The name of the input binary field containing the file to be written',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Append',
                name: 'append',
                type: 'boolean',
                default: false,
                description: "Whether to append to an existing file. While it's commonly used with text files, it's not limited to them, however, it wouldn't be applicable for file types that have a specific structure like most binary formats.",
            },
        ],
    },
];
const displayOptions = {
    show: {
        operation: ['write'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(items) {
    const returnData = [];
    let fileName;
    let item;
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
            const dataPropertyName = this.getNodeParameter('dataPropertyName', itemIndex);
            fileName = this.getNodeParameter('fileName', itemIndex);
            const options = this.getNodeParameter('options', itemIndex, {});
            const flag = options.append
                ? node_fs_1.constants.O_APPEND
                : node_fs_1.constants.O_WRONLY | node_fs_1.constants.O_CREAT | node_fs_1.constants.O_TRUNC;
            item = items[itemIndex];
            const newItem = {
                json: {},
                pairedItem: {
                    item: itemIndex,
                },
            };
            Object.assign(newItem.json, item.json);
            const binaryData = this.helpers.assertBinaryData(itemIndex, dataPropertyName);
            let fileContent;
            if (binaryData.id) {
                fileContent = await this.helpers.getBinaryStream(binaryData.id);
            }
            else {
                fileContent = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
            }
            // Write the file to disk
            await this.helpers.writeContentToFile(await this.helpers.resolvePath(fileName), fileContent, flag);
            if (item.binary !== undefined) {
                // Create a shallow copy of the binary data so that the old
                // data references which do not get changed still stay behind
                // but the incoming data does not get changed.
                newItem.binary = {};
                Object.assign(newItem.binary, item.binary);
            }
            // Add the file name to data
            newItem.json.fileName = fileName;
            returnData.push(newItem);
        }
        catch (error) {
            const nodeOperatioinError = utils_1.errorMapper.call(this, error, itemIndex, {
                filePath: fileName,
                operation: 'write',
            });
            if (this.continueOnFail()) {
                returnData.push({
                    json: {
                        error: nodeOperatioinError.message,
                    },
                    pairedItem: {
                        item: itemIndex,
                    },
                });
                continue;
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex });
        }
    }
    return returnData;
}
//# sourceMappingURL=write.operation.js.map
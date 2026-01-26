"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../../transport");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.siteRLC,
        description: 'Select the site to retrieve folders from',
    },
    {
        ...common_descriptions_1.folderRLC,
        description: 'Select the folder to update the file in',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
            },
        },
    },
    {
        ...common_descriptions_1.fileRLC,
        description: 'Select the file to update',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
                ...common_descriptions_1.untilFolderSelected,
            },
        },
    },
    {
        displayName: 'Updated File Name',
        name: 'fileName',
        default: '',
        description: 'If not specified, the original file name will be used',
        placeholder: 'e.g. My New File',
        routing: {
            send: {
                property: 'name',
                type: 'body',
                value: '={{ $value }}',
            },
        },
        type: 'string',
    },
    {
        displayName: 'Change File Content',
        name: 'changeFileContent',
        default: false,
        description: 'Whether to update the file contents',
        placeholder: 'e.g. My New File',
        required: true,
        type: 'boolean',
    },
    {
        displayName: 'Updated File Contents',
        name: 'fileContents',
        default: '',
        description: 'Find the name of input field containing the binary data to update the file with in the Input panel on the left, in the Binary tab',
        displayOptions: {
            show: {
                changeFileContent: [true],
            },
        },
        hint: 'The name of the input field containing the binary file data to update the file with',
        placeholder: 'data',
        required: true,
        routing: {
            output: {
                postReceive: [
                    async function (items, _response) {
                        for (const item of items) {
                            const site = this.getNodeParameter('site', undefined, {
                                extractValue: true,
                            });
                            const file = this.getNodeParameter('file', undefined, {
                                extractValue: true,
                            });
                            const binaryProperty = this.getNodeParameter('fileContents');
                            this.helpers.assertBinaryData(binaryProperty);
                            const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(binaryProperty);
                            const response = await transport_1.microsoftSharePointApiRequest.call(this, 'PUT', `/sites/${site}/drive/items/${file}/content`, binaryDataBuffer);
                            item.json = response;
                        }
                        return items;
                    },
                ],
            },
        },
        type: 'string',
    },
];
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['update'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=update.operation.js.map
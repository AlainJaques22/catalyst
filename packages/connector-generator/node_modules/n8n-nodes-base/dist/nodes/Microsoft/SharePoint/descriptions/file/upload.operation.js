"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.siteRLC,
        description: 'Select the site to retrieve folders from',
    },
    {
        ...common_descriptions_1.folderRLC,
        description: 'Select the folder to upload the file to',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
            },
        },
    },
    {
        displayName: 'File Name',
        name: 'fileName',
        default: '',
        description: 'The name of the file being uploaded',
        placeholder: 'e.g. My New File',
        required: true,
        type: 'string',
    },
    {
        displayName: 'File Contents',
        name: 'fileContents',
        default: '',
        description: 'Find the name of input field containing the binary data to upload in the Input panel on the left, in the Binary tab',
        hint: 'The name of the input field containing the binary file data to upload',
        placeholder: 'data',
        required: true,
        routing: {
            send: {
                preSend: [utils_1.uploadFilePreSend],
            },
        },
        type: 'string',
    },
];
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['upload'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=upload.operation.js.map
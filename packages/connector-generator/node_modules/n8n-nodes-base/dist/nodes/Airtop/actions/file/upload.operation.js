"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const helpers_1 = require("./helpers");
const GenericFunctions_1 = require("../../GenericFunctions");
const fields_1 = require("../common/fields");
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['upload'],
    },
};
exports.description = [
    {
        ...fields_1.sessionIdField,
        description: 'The session ID to load the file into',
        displayOptions,
    },
    {
        ...fields_1.windowIdField,
        description: 'The window ID to trigger the file input in',
        displayOptions,
    },
    {
        displayName: 'File Name',
        name: 'fileName',
        type: 'string',
        default: '',
        required: true,
        description: 'Name for the file to upload. For a session, all files loaded should have <b>unique names</b>.',
        displayOptions,
    },
    {
        displayName: 'File Type',
        name: 'fileType',
        type: 'options',
        options: [
            {
                name: 'Browser Download',
                value: 'browser_download',
            },
            {
                name: 'Screenshot',
                value: 'screenshot',
            },
            {
                name: 'Video',
                value: 'video',
            },
            {
                name: 'Customer Upload',
                value: 'customer_upload',
            },
        ],
        default: 'customer_upload',
        description: "Choose the type of file to upload. Defaults to 'Customer Upload'.",
        displayOptions,
    },
    {
        displayName: 'Source',
        name: 'source',
        type: 'options',
        options: [
            {
                name: 'URL',
                value: 'url',
            },
            {
                name: 'Binary',
                value: 'binary',
            },
        ],
        default: 'url',
        description: 'Source of the file to upload',
        displayOptions,
    },
    {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: {
            show: {
                source: ['binary'],
                ...displayOptions.show,
            },
        },
        description: 'Name of the binary property containing the file data',
    },
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                source: ['url'],
                ...displayOptions.show,
            },
        },
        description: 'URL from where to fetch the file to upload',
    },
    {
        displayName: 'Trigger File Input',
        name: 'triggerFileInputParameter',
        type: 'boolean',
        default: true,
        description: 'Whether to automatically trigger the file input dialog in the current window. If disabled, the file will only be uploaded to the session without opening the file input dialog.',
        displayOptions,
    },
    {
        ...fields_1.elementDescriptionField,
        description: 'Optional description of the file input to interact with',
        placeholder: 'e.g. the file upload selection box',
        displayOptions: {
            show: {
                triggerFileInputParameter: [true],
                ...displayOptions.show,
            },
        },
    },
    {
        ...fields_1.includeHiddenElementsField,
        displayOptions: {
            show: {
                triggerFileInputParameter: [true],
                ...displayOptions.show,
            },
        },
    },
];
async function execute(index) {
    const sessionId = GenericFunctions_1.validateRequiredStringField.call(this, index, 'sessionId', 'Session ID');
    const windowId = GenericFunctions_1.validateRequiredStringField.call(this, index, 'windowId', 'Window ID');
    const fileName = this.getNodeParameter('fileName', index, '');
    const fileType = this.getNodeParameter('fileType', index, 'customer_upload');
    const source = this.getNodeParameter('source', index, 'url');
    const url = this.getNodeParameter('url', index, '');
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, '');
    const triggerFileInputParameter = this.getNodeParameter('triggerFileInputParameter', index, true);
    const elementDescription = this.getNodeParameter('elementDescription', index, '');
    const includeHiddenElements = this.getNodeParameter('includeHiddenElements', index, false);
    // Get the file content based on source type
    const fileValue = source === 'url' ? url : binaryPropertyName;
    try {
        const fileBuffer = await helpers_1.createFileBuffer.call(this, source, fileValue, index);
        const fileId = await helpers_1.createAndUploadFile.call(this, fileName, fileBuffer, fileType);
        // Push file to session
        await helpers_1.pushFileToSession.call(this, fileId, sessionId);
        if (triggerFileInputParameter) {
            await helpers_1.triggerFileInput.call(this, {
                fileId,
                windowId,
                sessionId,
                elementDescription,
                includeHiddenElements,
            });
        }
        return this.helpers.returnJsonArray({
            sessionId,
            windowId,
            data: {
                fileId,
                message: 'File uploaded successfully',
            },
        });
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
    }
}
//# sourceMappingURL=upload.operation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const helpers_1 = require("./helpers");
const fields_1 = require("../common/fields");
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['load'],
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
        displayName: 'File ID',
        name: 'fileId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID of the file to load into the session',
        displayOptions,
    },
    {
        ...fields_1.elementDescriptionField,
        description: 'Optional description of the file input to interact with',
        placeholder: 'e.g. the file upload selection box',
        displayOptions,
    },
    {
        ...fields_1.includeHiddenElementsField,
        displayOptions,
    },
];
async function execute(index) {
    const fileId = this.getNodeParameter('fileId', index, '');
    const sessionId = this.getNodeParameter('sessionId', index, '');
    const windowId = this.getNodeParameter('windowId', index, '');
    const elementDescription = this.getNodeParameter('elementDescription', index, '');
    const includeHiddenElements = this.getNodeParameter('includeHiddenElements', index, false);
    try {
        await helpers_1.pushFileToSession.call(this, fileId, sessionId);
        await helpers_1.triggerFileInput.call(this, {
            fileId,
            windowId,
            sessionId,
            elementDescription,
            includeHiddenElements,
        });
        return this.helpers.returnJsonArray({
            sessionId,
            windowId,
            data: {
                message: 'File loaded successfully',
            },
        });
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
    }
}
//# sourceMappingURL=load.operation.js.map
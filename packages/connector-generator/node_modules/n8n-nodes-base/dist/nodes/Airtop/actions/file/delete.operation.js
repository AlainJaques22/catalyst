"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../../constants");
const transport_1 = require("../../transport");
exports.description = [
    {
        displayName: 'File ID',
        name: 'fileId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID of the file to delete',
        displayOptions: {
            show: {
                resource: ['file'],
                operation: ['deleteFile'],
            },
        },
    },
];
async function execute(index) {
    const fileId = this.getNodeParameter('fileId', index, '');
    if (!fileId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), constants_1.ERROR_MESSAGES.REQUIRED_PARAMETER.replace('{{field}}', 'File ID'));
    }
    await transport_1.apiRequest.call(this, 'DELETE', `/files/${fileId}`);
    return this.helpers.returnJsonArray({ data: { message: 'File deleted successfully' } });
}
//# sourceMappingURL=delete.operation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../../constants");
const transport_1 = require("../../transport");
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['get'],
    },
};
exports.description = [
    {
        displayName: 'File ID',
        name: 'fileId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID of the file to retrieve',
        displayOptions,
    },
    {
        displayName: 'Output Binary File',
        name: 'outputBinaryFile',
        type: 'boolean',
        default: false,
        description: 'Whether to output the file in binary format if the file is ready for download',
        displayOptions,
    },
];
async function execute(index) {
    const fileId = this.getNodeParameter('fileId', index, '');
    const outputBinaryFile = this.getNodeParameter('outputBinaryFile', index, false);
    if (!fileId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), constants_1.ERROR_MESSAGES.REQUIRED_PARAMETER.replace('{{field}}', 'File ID'));
    }
    const response = (await transport_1.apiRequest.call(this, 'GET', `/files/${fileId}`));
    const { fileName = '', downloadUrl = '', status = '' } = response?.data ?? {};
    // Handle binary file output
    if (outputBinaryFile && downloadUrl && status === 'available') {
        const buffer = (await this.helpers.httpRequest({
            url: downloadUrl,
            json: false,
            encoding: 'arraybuffer',
        }));
        const file = await this.helpers.prepareBinaryData(buffer, fileName);
        return [
            {
                json: {
                    ...response,
                },
                binary: { data: file },
            },
        ];
    }
    return this.helpers.returnJsonArray({ ...response });
}
//# sourceMappingURL=get.operation.js.map
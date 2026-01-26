"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.caseRLC,
    {
        displayName: 'Attachment Name or ID',
        name: 'attachmentId',
        type: 'options',
        default: '',
        required: true,
        description: 'ID of the attachment. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        typeOptions: {
            loadOptionsMethod: 'loadCaseAttachments',
            loadOptionsDependsOn: ['caseId.value'],
        },
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                description: 'Rename the file when downloading',
            },
            {
                displayName: 'Data Property Name',
                name: 'dataPropertyName',
                type: 'string',
                default: 'data',
                description: 'Name of the binary property to which write the data of the attachment',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['case'],
        operation: ['getAttachment'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const caseId = this.getNodeParameter('caseId', i, '', { extractValue: true });
    const options = this.getNodeParameter('options', i);
    const attachmentId = this.getNodeParameter('attachmentId', i);
    const requestOptions = {
        useStream: true,
        resolveWithFullResponse: true,
        encoding: null,
        json: false,
    };
    const response = await transport_1.theHiveApiRequest.call(this, 'GET', `/v1/case/${caseId}/attachment/${attachmentId}/download`, undefined, undefined, undefined, requestOptions);
    const mimeType = response.headers?.['content-type'] ?? undefined;
    let fileName = options.fileName || 'attachment';
    if (!options.fileName && response.headers['content-disposition'] !== undefined) {
        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch !== null) {
            fileName = fileNameMatch[1];
        }
    }
    const newItem = {
        json: {
            _id: attachmentId,
            caseId,
            fileName,
            mimeType,
        },
        binary: {},
    };
    newItem.binary[options.dataPropertyName || 'data'] =
        await this.helpers.prepareBinaryData(response.body, fileName, mimeType);
    const executionData = this.helpers.constructExecutionMetaData([newItem], {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=getAttachment.operation.js.map
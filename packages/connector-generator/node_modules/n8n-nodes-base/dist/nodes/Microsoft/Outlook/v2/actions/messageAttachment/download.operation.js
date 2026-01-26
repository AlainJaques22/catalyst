"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
exports.properties = [
    descriptions_1.messageRLC,
    descriptions_1.attachmentRLC,
    {
        displayName: 'Put Output in Field',
        name: 'binaryPropertyName',
        hint: 'The name of the output field to put the binary file data in',
        type: 'string',
        required: true,
        default: 'data',
    },
];
const displayOptions = {
    show: {
        resource: ['messageAttachment'],
        operation: ['download'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index, items) {
    const messageId = this.getNodeParameter('messageId', index, undefined, {
        extractValue: true,
    });
    const attachmentId = this.getNodeParameter('attachmentId', index, undefined, {
        extractValue: true,
    });
    const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', index);
    // Get attachment details first
    const attachmentDetails = await transport_1.microsoftApiRequest.call(this, 'GET', `/messages/${messageId}/attachments/${attachmentId}`, undefined, { $select: 'id,name,contentType' });
    let mimeType;
    if (attachmentDetails.contentType) {
        mimeType = attachmentDetails.contentType;
    }
    const fileName = attachmentDetails.name;
    const response = await transport_1.microsoftApiRequest.call(this, 'GET', `/messages/${messageId}/attachments/${attachmentId}/$value`, undefined, {}, undefined, {}, { encoding: null, resolveWithFullResponse: true });
    const newItem = {
        json: items[index].json,
        binary: {},
    };
    if (items[index].binary !== undefined) {
        // Create a shallow copy of the binary data so that the old
        // data references which do not get changed still stay behind
        // but the incoming data does not get changed.
        Object.assign(newItem.binary, items[index].binary);
    }
    const data = Buffer.from(response.body, 'utf8');
    newItem.binary[dataPropertyNameDownload] = await this.helpers.prepareBinaryData(data, fileName, mimeType);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(newItem), { itemData: { item: index } });
    return executionData;
}
//# sourceMappingURL=download.operation.js.map
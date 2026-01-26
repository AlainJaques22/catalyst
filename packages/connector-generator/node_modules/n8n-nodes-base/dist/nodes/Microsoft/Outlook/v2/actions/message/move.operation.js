"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
exports.properties = [
    descriptions_1.messageRLC,
    { ...descriptions_1.folderRLC, displayName: 'Parent Folder' },
];
const displayOptions = {
    show: {
        resource: ['message'],
        operation: ['move'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    const messageId = this.getNodeParameter('messageId', index, undefined, {
        extractValue: true,
    });
    const destinationId = this.getNodeParameter('folderId', index, undefined, {
        extractValue: true,
    });
    const body = {
        destinationId,
    };
    await transport_1.microsoftApiRequest.call(this, 'POST', `/messages/${messageId}/move`, body);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ success: true }), { itemData: { item: index } });
    return executionData;
}
//# sourceMappingURL=move.operation.js.map
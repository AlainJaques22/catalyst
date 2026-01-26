"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.chatRLC,
    {
        displayName: 'Message ID',
        name: 'messageId',
        required: true,
        type: 'string',
        default: '',
        placeholder: 'e.g. 1673355049064',
        description: 'The ID of the message to retrieve',
    },
];
const displayOptions = {
    show: {
        resource: ['chatMessage'],
        operation: ['get'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.microsoft.com/en-us/graph/api/chat-list-messages?view=graph-rest-1.0&tabs=http
    try {
        const chatId = this.getNodeParameter('chatId', i, '', { extractValue: true });
        const messageId = this.getNodeParameter('messageId', i);
        return await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/chats/${chatId}/messages/${messageId}`);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), "The message you are trying to get doesn't exist", {
            description: "Check that the 'Message ID' parameter is correctly set",
        });
    }
}
//# sourceMappingURL=get.operation.js.map
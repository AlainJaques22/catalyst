"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.chatRLC,
    {
        displayName: 'Content Type',
        name: 'contentType',
        required: true,
        type: 'options',
        options: [
            {
                name: 'Text',
                value: 'text',
            },
            {
                name: 'HTML',
                value: 'html',
            },
        ],
        default: 'text',
        description: 'Whether the message is plain text or HTML',
    },
    {
        displayName: 'Message',
        name: 'message',
        required: true,
        type: 'string',
        default: '',
        description: 'The content of the message to be sent',
        typeOptions: {
            rows: 2,
        },
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        default: {},
        description: 'Other options to set',
        placeholder: 'Add option',
        options: [
            {
                displayName: 'Include Link to Workflow',
                name: 'includeLinkToWorkflow',
                type: 'boolean',
                default: true,
                description: 'Whether to append a link to this workflow at the end of the message. This is helpful if you have many workflows sending messages.',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['chatMessage'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i, instanceId) {
    // https://docs.microsoft.com/en-us/graph/api/channel-post-messages?view=graph-rest-1.0&tabs=http
    const chatId = this.getNodeParameter('chatId', i, '', { extractValue: true });
    const contentType = this.getNodeParameter('contentType', i);
    const message = this.getNodeParameter('message', i);
    const options = this.getNodeParameter('options', i, {});
    const includeLinkToWorkflow = options.includeLinkToWorkflow !== false;
    const body = utils_1.prepareMessage.call(this, message, contentType, includeLinkToWorkflow, instanceId);
    return await transport_1.microsoftApiRequest.call(this, 'POST', `/v1.0/chats/${chatId}/messages`, body);
}
//# sourceMappingURL=create.operation.js.map
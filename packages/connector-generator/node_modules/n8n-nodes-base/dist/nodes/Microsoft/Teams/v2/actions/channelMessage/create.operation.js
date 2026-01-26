"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.teamRLC,
    descriptions_1.channelRLC,
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
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Include Link to Workflow',
                name: 'includeLinkToWorkflow',
                type: 'boolean',
                default: true,
                description: 'Whether to append a link to this workflow at the end of the message. This is helpful if you have many workflows sending messages.',
            },
            {
                displayName: 'Reply to ID',
                name: 'makeReply',
                type: 'string',
                default: '',
                placeholder: 'e.g. 1673348720590',
                description: 'An optional ID of the message you want to reply to. The message ID is the number before "?tenantId" in the message URL.',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['channelMessage'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i, nodeVersion, instanceId) {
    //https://docs.microsoft.com/en-us/graph/api/channel-post-messages?view=graph-rest-beta&tabs=http
    //https://docs.microsoft.com/en-us/graph/api/channel-post-messagereply?view=graph-rest-beta&tabs=http
    const teamId = this.getNodeParameter('teamId', i, '', { extractValue: true });
    const channelId = this.getNodeParameter('channelId', i, '', { extractValue: true });
    const contentType = this.getNodeParameter('contentType', i);
    const message = this.getNodeParameter('message', i);
    const options = this.getNodeParameter('options', i);
    let includeLinkToWorkflow = options.includeLinkToWorkflow;
    if (includeLinkToWorkflow === undefined) {
        includeLinkToWorkflow = nodeVersion >= 1.1;
    }
    const body = utils_1.prepareMessage.call(this, message, contentType, includeLinkToWorkflow, instanceId);
    if (options.makeReply) {
        const replyToId = options.makeReply;
        return await transport_1.microsoftApiRequest.call(this, 'POST', `/beta/teams/${teamId}/channels/${channelId}/messages/${replyToId}/replies`, body);
    }
    else {
        return await transport_1.microsoftApiRequest.call(this, 'POST', `/beta/teams/${teamId}/channels/${channelId}/messages`, body);
    }
}
//# sourceMappingURL=create.operation.js.map
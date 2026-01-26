"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utils_1 = require("../../../../../../utils/sendAndWait/utils");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
exports.description = (0, utils_1.getSendAndWaitProperties)([descriptions_1.chatRLC], 'chatMessage', undefined, {
    noButtonStyle: true,
    defaultApproveLabel: '✓ Approve',
    defaultDisapproveLabel: '✗ Decline',
}).filter((p) => p.name !== 'subject');
async function execute(i, instanceId) {
    const chatId = this.getNodeParameter('chatId', i, '', { extractValue: true });
    const config = (0, utils_1.getSendAndWaitConfig)(this);
    const buttons = config.options.map((option) => `<a href="${option.url}">${option.label}</a>`);
    let content = `${config.message}<br><br>${buttons.join(' ')}`;
    if (config.appendAttribution !== false) {
        const attributionText = 'This message was sent automatically with';
        const link = (0, utilities_1.createUtmCampaignLink)('n8n-nodes-base.microsoftTeams', instanceId);
        const attribution = `<em>${attributionText} <a href="${link}">n8n</a></em>`;
        content += `<br><br>${attribution}`;
    }
    const body = {
        body: {
            contentType: 'html',
            content,
        },
    };
    return await transport_1.microsoftApiRequest.call(this, 'POST', `/v1.0/chats/${chatId}/messages`, body);
}
//# sourceMappingURL=sendAndWait.operation.js.map
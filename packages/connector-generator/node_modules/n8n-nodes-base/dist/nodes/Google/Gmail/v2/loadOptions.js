"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabels = void 0;
exports.getThreadMessages = getThreadMessages;
exports.getGmailAliases = getGmailAliases;
const GenericFunctions_1 = require("../GenericFunctions");
Object.defineProperty(exports, "getLabels", { enumerable: true, get: function () { return GenericFunctions_1.getLabels; } });
async function getThreadMessages() {
    const returnData = [];
    const id = this.getNodeParameter('threadId', 0);
    const { messages } = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/gmail/v1/users/me/threads/${id}`, {}, { format: 'minimal' });
    for (const message of messages || []) {
        returnData.push({
            name: message.snippet,
            value: message.id,
        });
    }
    return returnData;
}
async function getGmailAliases() {
    const returnData = [];
    const { sendAs } = await GenericFunctions_1.googleApiRequest.call(this, 'GET', '/gmail/v1/users/me/settings/sendAs');
    for (const alias of sendAs || []) {
        const displayName = alias.isDefault ? `${alias.sendAsEmail} (Default)` : alias.sendAsEmail;
        returnData.push({
            name: displayName,
            value: alias.sendAsEmail,
        });
    }
    return returnData;
}
//# sourceMappingURL=loadOptions.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToEmail = replyToEmail;
const uniq_1 = __importDefault(require("lodash/uniq"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../GenericFunctions");
async function replyToEmail(gmailId, options, itemIndex, nodeVersion) {
    if (options.replyToSenderOnly && options.replyToRecipientsOnly) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Both "Reply to Sender Only" and "Reply to Recipient Only" cannot be enabled at the same time. Please select only one option.', { itemIndex });
    }
    let qs = {};
    let cc = '';
    let bcc = '';
    if (options.ccList) {
        cc = GenericFunctions_1.prepareEmailsInput.call(this, options.ccList, 'CC', itemIndex);
    }
    if (options.bccList) {
        bcc = GenericFunctions_1.prepareEmailsInput.call(this, options.bccList, 'BCC', itemIndex);
    }
    let attachments = [];
    if (options.attachmentsUi) {
        attachments = await GenericFunctions_1.prepareEmailAttachments.call(this, options.attachmentsUi, itemIndex);
        if (attachments.length) {
            qs = {
                userId: 'me',
                uploadType: 'media',
            };
        }
    }
    const endpoint = `/gmail/v1/users/me/messages/${gmailId}`;
    qs.format = 'metadata';
    const { payload, threadId } = (await GenericFunctions_1.googleApiRequest.call(this, 'GET', endpoint, {}, qs));
    const subject = payload.headers.filter((data) => data.name.toLowerCase() === 'subject')[0]?.value || '';
    const messageIdGlobal = payload.headers.filter((data) => data.name.toLowerCase() === 'message-id')[0]?.value || '';
    const { emailAddress } = (await GenericFunctions_1.googleApiRequest.call(this, 'GET', '/gmail/v1/users/me/profile'));
    const to = [];
    const replyToSenderOnly = options.replyToSenderOnly === undefined ? false : options.replyToSenderOnly;
    const replyToRecipientsOnly = options.replyToRecipientsOnly === undefined
        ? false
        : options.replyToRecipientsOnly;
    const prepareEmailString = (email) => {
        if (email.includes(emailAddress))
            return;
        if (email.includes('<') && email.includes('>')) {
            to.push(email);
        }
        else {
            to.push(`<${email}>`);
        }
    };
    let replyToHeaderName = 'from';
    if (nodeVersion >= 2.2 && payload.headers.some((h) => h.name.toLowerCase() === 'reply-to')) {
        replyToHeaderName = 'reply-to';
    }
    for (const header of payload.headers) {
        const headerName = (header.name || '').toLowerCase();
        if (headerName === replyToHeaderName && !replyToRecipientsOnly) {
            const replyToEmail = header.value;
            if (replyToEmail.includes('<') && replyToEmail.includes('>')) {
                to.push(replyToEmail);
            }
            else {
                to.push(`<${replyToEmail}>`);
            }
        }
        if (headerName === 'to' && !replyToSenderOnly) {
            const toEmails = header.value;
            toEmails.split(',').forEach(prepareEmailString);
        }
    }
    let from = '';
    if (options.senderName) {
        from = `${options.senderName} <${emailAddress}>`;
    }
    const toString = (0, uniq_1.default)(to).join(', ');
    const email = {
        from,
        to: toString,
        cc,
        bcc,
        subject,
        attachments,
        inReplyTo: messageIdGlobal,
        reference: messageIdGlobal,
        ...GenericFunctions_1.prepareEmailBody.call(this, itemIndex),
    };
    const body = {
        raw: await (0, GenericFunctions_1.encodeEmail)(email),
        threadId,
    };
    return (await GenericFunctions_1.googleApiRequest.call(this, 'POST', '/gmail/v1/users/me/messages/send', body, qs));
}
//# sourceMappingURL=replyToEmail.js.map
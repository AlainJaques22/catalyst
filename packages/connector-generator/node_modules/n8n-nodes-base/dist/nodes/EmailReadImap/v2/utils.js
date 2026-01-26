"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewEmails = getNewEmails;
const imap_1 = require("@n8n/imap");
const find_1 = __importDefault(require("lodash/find"));
const mailparser_1 = require("mailparser");
const n8n_workflow_1 = require("n8n-workflow");
async function parseRawEmail(messageEncoded, dataPropertyNameDownload) {
    const responseData = await (0, mailparser_1.simpleParser)(messageEncoded);
    const headers = {};
    const additionalData = {};
    for (const header of responseData.headerLines) {
        headers[header.key] = header.line;
    }
    additionalData.headers = headers;
    additionalData.headerLines = undefined;
    const binaryData = {};
    if (responseData.attachments) {
        for (let i = 0; i < responseData.attachments.length; i++) {
            const attachment = responseData.attachments[i];
            binaryData[`${dataPropertyNameDownload}${i}`] = await this.helpers.prepareBinaryData(attachment.content, attachment.filename, attachment.contentType);
        }
        additionalData.attachments = undefined;
    }
    return {
        json: { ...responseData, ...additionalData },
        binary: Object.keys(binaryData).length ? binaryData : undefined,
    };
}
const EMAIL_BATCH_SIZE = 20;
async function getNewEmails({ getAttachment, getText, onEmailBatch, imapConnection, postProcessAction, searchCriteria, }) {
    const format = this.getNodeParameter('format', 0);
    let fetchOptions = {};
    if (format === 'simple' || format === 'raw') {
        fetchOptions = {
            bodies: ['TEXT', 'HEADER'],
            markSeen: false,
            struct: true,
        };
    }
    else if (format === 'resolved') {
        fetchOptions = {
            bodies: [''],
            markSeen: false,
            struct: true,
        };
    }
    let results = [];
    let maxUid = 0;
    const staticData = this.getWorkflowStaticData('node');
    const limit = this.getNode().typeVersion >= 2.1 ? EMAIL_BATCH_SIZE : undefined;
    do {
        if (maxUid) {
            searchCriteria = searchCriteria.filter((criteria) => {
                if (Array.isArray(criteria)) {
                    return !['UID', 'SINCE'].includes(criteria[0]);
                }
                return true;
            });
            searchCriteria.push(['UID', `${maxUid}:*`]);
        }
        results = await imapConnection.search(searchCriteria, fetchOptions, limit);
        this.logger.debug(`Process ${results.length} new emails in node "EmailReadImap"`);
        const newEmails = [];
        let newEmail;
        let attachments;
        let propertyName;
        // All properties get by default moved to metadata except the ones
        // which are defined here which get set on the top level.
        const topLevelProperties = ['cc', 'date', 'from', 'subject', 'to'];
        if (format === 'resolved') {
            const dataPropertyAttachmentsPrefixName = this.getNodeParameter('dataPropertyAttachmentsPrefixName');
            for (const message of results) {
                const lastMessageUid = this.getWorkflowStaticData('node').lastMessageUid;
                if (lastMessageUid !== undefined && message.attributes.uid <= lastMessageUid) {
                    continue;
                }
                // Track the maximum UID to update staticData later
                if (message.attributes.uid > maxUid) {
                    maxUid = message.attributes.uid;
                }
                const part = (0, find_1.default)(message.parts, { which: '' });
                if (part === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Email part could not be parsed.');
                }
                const parsedEmail = await parseRawEmail.call(this, part.body, dataPropertyAttachmentsPrefixName);
                parsedEmail.json.attributes = {
                    uid: message.attributes.uid,
                };
                newEmails.push(parsedEmail);
            }
        }
        else if (format === 'simple') {
            const downloadAttachments = this.getNodeParameter('downloadAttachments');
            let dataPropertyAttachmentsPrefixName = '';
            if (downloadAttachments) {
                dataPropertyAttachmentsPrefixName = this.getNodeParameter('dataPropertyAttachmentsPrefixName');
            }
            for (const message of results) {
                const lastMessageUid = this.getWorkflowStaticData('node').lastMessageUid;
                if (lastMessageUid !== undefined && message.attributes.uid <= lastMessageUid) {
                    continue;
                }
                // Track the maximum UID to update staticData later
                if (message.attributes.uid > maxUid) {
                    maxUid = message.attributes.uid;
                }
                const parts = (0, imap_1.getParts)(message.attributes.struct);
                newEmail = {
                    json: {
                        textHtml: await getText(parts, message, 'html'),
                        textPlain: await getText(parts, message, 'plain'),
                        metadata: {},
                        attributes: {
                            uid: message.attributes.uid,
                        },
                    },
                };
                const messageHeader = message.parts.filter((part) => part.which === 'HEADER');
                const messageBody = messageHeader[0].body;
                for (propertyName of Object.keys(messageBody)) {
                    if (messageBody[propertyName].length) {
                        if (topLevelProperties.includes(propertyName)) {
                            newEmail.json[propertyName] = messageBody[propertyName][0];
                        }
                        else {
                            newEmail.json.metadata[propertyName] = messageBody[propertyName][0];
                        }
                    }
                }
                if (downloadAttachments) {
                    // Get attachments and add them if any get found
                    attachments = await getAttachment(imapConnection, parts, message);
                    if (attachments.length) {
                        newEmail.binary = {};
                        for (let i = 0; i < attachments.length; i++) {
                            newEmail.binary[`${dataPropertyAttachmentsPrefixName}${i}`] = attachments[i];
                        }
                    }
                }
                newEmails.push(newEmail);
            }
        }
        else if (format === 'raw') {
            for (const message of results) {
                const lastMessageUid = this.getWorkflowStaticData('node').lastMessageUid;
                if (lastMessageUid !== undefined && message.attributes.uid <= lastMessageUid) {
                    continue;
                }
                // Track the maximum UID to update staticData later
                if (message.attributes.uid > maxUid) {
                    maxUid = message.attributes.uid;
                }
                const part = (0, find_1.default)(message.parts, { which: 'TEXT' });
                if (part === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Email part could not be parsed.');
                }
                // Return base64 string
                newEmail = {
                    json: {
                        raw: part.body,
                    },
                };
                newEmails.push(newEmail);
            }
        }
        // only mark messages as seen once processing has finished
        if (postProcessAction === 'read') {
            const uidList = results.map((e) => e.attributes.uid);
            if (uidList.length > 0) {
                await imapConnection.addFlags(uidList, '\\SEEN');
            }
        }
        await onEmailBatch(newEmails);
    } while (results.length >= EMAIL_BATCH_SIZE);
    // Update lastMessageUid after processing all messages
    if (maxUid > (staticData.lastMessageUid ?? 0)) {
        this.getWorkflowStaticData('node').lastMessageUid = maxUid;
    }
}
//# sourceMappingURL=utils.js.map
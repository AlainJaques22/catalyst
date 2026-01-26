"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../utils/utilities");
const descriptions_1 = require("./descriptions");
const utils_1 = require("./utils");
const descriptions_2 = require("../../../utils/descriptions");
const properties = [
    // TODO: Add choice for text as text or html  (maybe also from name)
    descriptions_1.fromEmailProperty,
    descriptions_1.toEmailProperty,
    {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        placeholder: 'My subject line',
        description: 'Subject line of the email',
    },
    {
        displayName: 'Email Format',
        name: 'emailFormat',
        type: 'options',
        options: [
            {
                name: 'Text',
                value: 'text',
                description: 'Send email as plain text',
            },
            {
                name: 'HTML',
                value: 'html',
                description: 'Send email as HTML',
            },
            {
                name: 'Both',
                value: 'both',
                description: "Send both formats, recipient's client selects version to display",
            },
        ],
        default: 'html',
        displayOptions: {
            hide: {
                '@version': [2],
            },
        },
    },
    {
        displayName: 'Email Format',
        name: 'emailFormat',
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
            {
                name: 'Both',
                value: 'both',
            },
        ],
        default: 'text',
        displayOptions: {
            show: {
                '@version': [2],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: {
            rows: 5,
        },
        default: '',
        description: 'Plain text message of email',
        displayOptions: {
            show: {
                emailFormat: ['text', 'both'],
            },
        },
    },
    {
        displayName: 'HTML',
        name: 'html',
        type: 'string',
        typeOptions: {
            rows: 5,
        },
        default: '',
        description: 'HTML text message of email',
        displayOptions: {
            show: {
                emailFormat: ['html', 'both'],
            },
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
                ...descriptions_2.appendAttributionOption,
                description: 'Whether to include the phrase “This email was sent automatically with n8n” to the end of the email',
            },
            {
                displayName: 'Attachments',
                name: 'attachments',
                type: 'string',
                default: '',
                description: 'Name of the binary properties that contain data to add to email as attachment. Multiple ones can be comma-separated. Reference embedded images or other content within the body of an email message, e.g. &lt;img src="cid:image_1"&gt;',
            },
            {
                displayName: 'CC Email',
                name: 'ccEmail',
                type: 'string',
                default: '',
                placeholder: 'cc@example.com',
                description: 'Email address of CC recipient',
            },
            {
                displayName: 'BCC Email',
                name: 'bccEmail',
                type: 'string',
                default: '',
                placeholder: 'bcc@example.com',
                description: 'Email address of BCC recipient',
            },
            {
                displayName: 'Ignore SSL Issues (Insecure)',
                name: 'allowUnauthorizedCerts',
                type: 'boolean',
                default: false,
                description: 'Whether to connect even if SSL certificate validation is not possible',
            },
            {
                displayName: 'Reply To',
                name: 'replyTo',
                type: 'string',
                default: '',
                placeholder: 'info@example.com',
                description: 'The email address to send the reply to',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['email'],
        operation: ['send'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute() {
    const items = this.getInputData();
    const nodeVersion = this.getNode().typeVersion;
    const instanceId = this.getInstanceId();
    const credentials = await this.getCredentials('smtp');
    const returnData = [];
    let item;
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
            item = items[itemIndex];
            const fromEmail = this.getNodeParameter('fromEmail', itemIndex);
            const toEmail = this.getNodeParameter('toEmail', itemIndex);
            const subject = this.getNodeParameter('subject', itemIndex);
            const emailFormat = this.getNodeParameter('emailFormat', itemIndex);
            const options = this.getNodeParameter('options', itemIndex, {});
            const transporter = (0, utils_1.configureTransport)(credentials, options);
            const mailOptions = {
                from: fromEmail,
                to: toEmail,
                cc: options.ccEmail,
                bcc: options.bccEmail,
                subject,
                replyTo: options.replyTo,
            };
            if (emailFormat === 'text' || emailFormat === 'both') {
                mailOptions.text = this.getNodeParameter('text', itemIndex, '');
            }
            if (emailFormat === 'html' || emailFormat === 'both') {
                mailOptions.html = this.getNodeParameter('html', itemIndex, '');
            }
            let appendAttribution = options.appendAttribution;
            if (appendAttribution === undefined) {
                appendAttribution = nodeVersion >= 2.1;
            }
            if (appendAttribution) {
                const attributionText = 'This email was sent automatically with ';
                const link = (0, utilities_1.createUtmCampaignLink)('n8n-nodes-base.emailSend', instanceId);
                if (emailFormat === 'html' || (emailFormat === 'both' && mailOptions.html)) {
                    mailOptions.html = `
					${mailOptions.html}
					<br>
					<br>
					---
					<br>
					<em>${attributionText}<a href="${link}" target="_blank">n8n</a></em>
					`;
                }
                else {
                    mailOptions.text = `${mailOptions.text}\n\n---\n${attributionText}n8n\n${'https://n8n.io'}`;
                }
            }
            if (options.attachments && item.binary) {
                const attachments = [];
                const attachmentProperties = options.attachments
                    .split(',')
                    .map((propertyName) => {
                    return propertyName.trim();
                });
                for (const propertyName of attachmentProperties) {
                    const binaryData = this.helpers.assertBinaryData(itemIndex, propertyName);
                    attachments.push({
                        filename: binaryData.fileName || 'unknown',
                        content: await this.helpers.getBinaryDataBuffer(itemIndex, propertyName),
                        cid: propertyName,
                    });
                }
                if (attachments.length) {
                    mailOptions.attachments = attachments;
                }
            }
            const info = await transporter.sendMail(mailOptions);
            returnData.push({
                json: info,
                pairedItem: {
                    item: itemIndex,
                },
            });
        }
        catch (error) {
            if (this.continueOnFail()) {
                returnData.push({
                    json: {
                        error: error.message,
                    },
                    pairedItem: {
                        item: itemIndex,
                    },
                });
                continue;
            }
            delete error.cert;
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    }
    return [returnData];
}
//# sourceMappingURL=send.operation.js.map
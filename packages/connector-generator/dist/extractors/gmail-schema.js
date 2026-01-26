"use strict";
/**
 * Static Gmail node schema
 *
 * This represents the extracted schema from n8n's Gmail node.
 * In production, this would be dynamically parsed from n8n-nodes-base.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmailOperations = exports.gmailAddLabelSchema = exports.gmailReplySchema = exports.gmailGetEmailSchema = exports.gmailSendEmailSchema = void 0;
exports.getGmailOperation = getGmailOperation;
exports.getAllGmailOperations = getAllGmailOperations;
/**
 * Gmail Send Email operation schema
 * Extracted from n8n-nodes-base Gmail node
 */
exports.gmailSendEmailSchema = {
    nodeId: 'gmail',
    nodeName: 'Gmail',
    resource: 'message',
    resourceName: 'Message',
    operation: 'send',
    operationName: 'Send',
    displayName: 'Gmail - Send Email',
    description: 'Send an email using Gmail',
    icon: 'file:gmail.svg',
    color: '#EA4335',
    credentials: ['gmailOAuth2'],
    parameters: [
        {
            name: 'to',
            displayName: 'To',
            type: 'string',
            required: true,
            description: 'Email address of the recipient',
            placeholder: 'recipient@example.com'
        },
        {
            name: 'subject',
            displayName: 'Subject',
            type: 'string',
            required: true,
            description: 'Subject line of the email',
            placeholder: 'Email subject'
        },
        {
            name: 'message',
            displayName: 'Message',
            type: 'string',
            required: true,
            description: 'The body content of the email (plain text or HTML)',
            placeholder: 'Your email message here'
        },
        {
            name: 'cc',
            displayName: 'CC',
            type: 'string',
            required: false,
            description: 'Email addresses to CC (comma-separated)',
            placeholder: 'cc@example.com'
        },
        {
            name: 'bcc',
            displayName: 'BCC',
            type: 'string',
            required: false,
            description: 'Email addresses to BCC (comma-separated)',
            placeholder: 'bcc@example.com'
        }
    ],
    category: 'communication',
    subcategory: 'email',
    tags: ['gmail', 'email', 'google', 'send', 'communication']
};
/**
 * Gmail Get Email operation schema
 */
exports.gmailGetEmailSchema = {
    nodeId: 'gmail',
    nodeName: 'Gmail',
    resource: 'message',
    resourceName: 'Message',
    operation: 'get',
    operationName: 'Get',
    displayName: 'Gmail - Get Email',
    description: 'Retrieve a specific email from Gmail',
    icon: 'file:gmail.svg',
    color: '#EA4335',
    credentials: ['gmailOAuth2'],
    parameters: [
        {
            name: 'messageId',
            displayName: 'Message ID',
            type: 'string',
            required: true,
            description: 'The ID of the email message to retrieve',
            placeholder: '18a1b2c3d4e5f6g7'
        }
    ],
    category: 'communication',
    subcategory: 'email',
    tags: ['gmail', 'email', 'google', 'read', 'communication']
};
/**
 * Gmail Reply to Email operation schema
 */
exports.gmailReplySchema = {
    nodeId: 'gmail',
    nodeName: 'Gmail',
    resource: 'message',
    resourceName: 'Message',
    operation: 'reply',
    operationName: 'Reply',
    displayName: 'Gmail - Reply to Email',
    description: 'Reply to an existing email in Gmail',
    icon: 'file:gmail.svg',
    color: '#EA4335',
    credentials: ['gmailOAuth2'],
    parameters: [
        {
            name: 'messageId',
            displayName: 'Message ID',
            type: 'string',
            required: true,
            description: 'The ID of the email message to reply to',
            placeholder: '18a1b2c3d4e5f6g7'
        },
        {
            name: 'message',
            displayName: 'Reply Message',
            type: 'string',
            required: true,
            description: 'The content of your reply',
            placeholder: 'Your reply here'
        }
    ],
    category: 'communication',
    subcategory: 'email',
    tags: ['gmail', 'email', 'google', 'reply', 'communication']
};
/**
 * Gmail Add Label operation schema
 */
exports.gmailAddLabelSchema = {
    nodeId: 'gmail',
    nodeName: 'Gmail',
    resource: 'message',
    resourceName: 'Message',
    operation: 'addLabel',
    operationName: 'Add Label',
    displayName: 'Gmail - Add Label',
    description: 'Add a label to an email in Gmail',
    icon: 'file:gmail.svg',
    color: '#EA4335',
    credentials: ['gmailOAuth2'],
    parameters: [
        {
            name: 'messageId',
            displayName: 'Message ID',
            type: 'string',
            required: true,
            description: 'The ID of the email message',
            placeholder: '18a1b2c3d4e5f6g7'
        },
        {
            name: 'labelId',
            displayName: 'Label ID',
            type: 'string',
            required: true,
            description: 'The ID of the label to add',
            placeholder: 'Label_123'
        }
    ],
    category: 'communication',
    subcategory: 'email',
    tags: ['gmail', 'email', 'google', 'label', 'organize', 'communication']
};
/**
 * All available Gmail operations
 */
exports.gmailOperations = [
    exports.gmailSendEmailSchema,
    exports.gmailGetEmailSchema,
    exports.gmailReplySchema,
    exports.gmailAddLabelSchema
];
/**
 * Get Gmail operation schema by operation name
 */
function getGmailOperation(operation) {
    return exports.gmailOperations.find(op => op.operation.toLowerCase() === operation.toLowerCase() ||
        op.operationName.toLowerCase() === operation.toLowerCase());
}
/**
 * Get all Gmail operations
 */
function getAllGmailOperations() {
    return exports.gmailOperations;
}

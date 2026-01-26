"use strict";
/**
 * Naming utilities for consistent connector naming
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = toKebabCase;
exports.toPascalCase = toPascalCase;
exports.toCamelCase = toCamelCase;
exports.toTitleCase = toTitleCase;
exports.generateConnectorId = generateConnectorId;
exports.generateDisplayName = generateDisplayName;
exports.generateTemplateId = generateTemplateId;
exports.generateWebhookPath = generateWebhookPath;
exports.generateWebhookUrl = generateWebhookUrl;
exports.generateProcessId = generateProcessId;
exports.sanitizeFilename = sanitizeFilename;
/**
 * Convert to kebab-case
 * "SendMessage" -> "send-message"
 * "send_message" -> "send-message"
 */
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase();
}
/**
 * Convert to PascalCase
 * "send-message" -> "SendMessage"
 */
function toPascalCase(str) {
    return str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
/**
 * Convert to camelCase
 * "send-message" -> "sendMessage"
 */
function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
/**
 * Convert to Title Case with spaces
 * "send-message" -> "Send Message"
 */
function toTitleCase(str) {
    return str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
/**
 * Generate connector ID from node and operation
 * "slack", "message", "send" -> "slack-send-message"
 */
function generateConnectorId(nodeId, resource, operation) {
    const parts = [
        toKebabCase(nodeId),
        toKebabCase(operation),
        toKebabCase(resource)
    ];
    return parts.join('-');
}
/**
 * Generate display name from node and operation
 * "Slack", "Message", "Send" -> "Slack - Send Message"
 */
function generateDisplayName(nodeName, resourceName, operationName) {
    return `${nodeName} - ${operationName} ${resourceName}`;
}
/**
 * Generate element template ID
 * "slack-send-message" -> "io.catalyst.template.slack-send-message"
 */
function generateTemplateId(connectorId) {
    return `io.catalyst.template.${connectorId}`;
}
/**
 * Generate webhook path
 * "slack-send-message" -> "catalyst-slack-send-message"
 */
function generateWebhookPath(connectorId) {
    return `catalyst-${connectorId}`;
}
/**
 * Generate webhook URL
 */
function generateWebhookUrl(connectorId) {
    return `http://catalyst-n8n:5678/webhook/${generateWebhookPath(connectorId)}`;
}
/**
 * Generate BPMN process ID
 * "slack-send-message" -> "slack-send-message-example"
 */
function generateProcessId(connectorId) {
    return `${connectorId}-example`;
}
/**
 * Sanitize filename (remove special characters)
 */
function sanitizeFilename(str) {
    return str.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
}

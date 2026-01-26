/**
 * Naming utilities for consistent connector naming
 */
/**
 * Convert to kebab-case
 * "SendMessage" -> "send-message"
 * "send_message" -> "send-message"
 */
export declare function toKebabCase(str: string): string;
/**
 * Convert to PascalCase
 * "send-message" -> "SendMessage"
 */
export declare function toPascalCase(str: string): string;
/**
 * Convert to camelCase
 * "send-message" -> "sendMessage"
 */
export declare function toCamelCase(str: string): string;
/**
 * Convert to Title Case with spaces
 * "send-message" -> "Send Message"
 */
export declare function toTitleCase(str: string): string;
/**
 * Generate connector ID from node and operation
 * "slack", "message", "send" -> "slack-send-message"
 */
export declare function generateConnectorId(nodeId: string, resource: string, operation: string): string;
/**
 * Generate display name from node and operation
 * "Slack", "Message", "Send" -> "Slack - Send Message"
 */
export declare function generateDisplayName(nodeName: string, resourceName: string, operationName: string): string;
/**
 * Generate element template ID
 * "slack-send-message" -> "io.catalyst.template.slack-send-message"
 */
export declare function generateTemplateId(connectorId: string): string;
/**
 * Generate webhook path
 * "slack-send-message" -> "catalyst-slack-send-message"
 */
export declare function generateWebhookPath(connectorId: string): string;
/**
 * Generate webhook URL
 */
export declare function generateWebhookUrl(connectorId: string): string;
/**
 * Generate BPMN process ID
 * "slack-send-message" -> "slack-send-message-example"
 */
export declare function generateProcessId(connectorId: string): string;
/**
 * Sanitize filename (remove special characters)
 */
export declare function sanitizeFilename(str: string): string;

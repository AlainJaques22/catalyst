/**
 * Naming utilities for consistent connector naming
 */

/**
 * Convert to kebab-case
 * "SendMessage" -> "send-message"
 * "send_message" -> "send-message"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

/**
 * Convert to PascalCase
 * "send-message" -> "SendMessage"
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert to camelCase
 * "send-message" -> "sendMessage"
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert to Title Case with spaces
 * "send-message" -> "Send Message"
 */
export function toTitleCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate connector ID from node and operation
 * "slack", "message", "send" -> "slack-send-message"
 */
export function generateConnectorId(nodeId: string, resource: string, operation: string): string {
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
export function generateDisplayName(nodeName: string, resourceName: string, operationName: string): string {
  return `${nodeName} - ${operationName} ${resourceName}`;
}

/**
 * Generate element template ID
 * "slack-send-message" -> "io.catalyst.template.slack-send-message"
 */
export function generateTemplateId(connectorId: string): string {
  return `io.catalyst.template.${connectorId}`;
}

/**
 * Generate webhook path
 * "slack-send-message" -> "catalyst-slack-send-message"
 */
export function generateWebhookPath(connectorId: string): string {
  return `catalyst-${connectorId}`;
}

/**
 * Generate webhook URL
 */
export function generateWebhookUrl(connectorId: string): string {
  return `http://catalyst-n8n:5678/webhook/${generateWebhookPath(connectorId)}`;
}

/**
 * Generate BPMN process ID
 * "slack-send-message" -> "slack-send-message-example"
 */
export function generateProcessId(connectorId: string): string {
  return `${connectorId}-example`;
}

/**
 * Sanitize filename (remove special characters)
 */
export function sanitizeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
}

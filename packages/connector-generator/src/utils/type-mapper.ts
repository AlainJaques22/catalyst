/**
 * Type mapping utilities: n8n types -> Catalyst element template types
 */

import { N8nParameter, OperationParameter, ElementTemplateProperty } from '../types';

/**
 * Map n8n parameter type to element template type
 */
export function mapN8nTypeToElementType(n8nType: string): 'String' | 'Text' | 'Dropdown' | 'Boolean' | 'Hidden' {
  switch (n8nType) {
    case 'string':
      return 'String';
    case 'number':
      return 'String'; // Camunda uses strings for numbers
    case 'boolean':
      return 'Dropdown'; // Will use true/false options
    case 'options':
      return 'Dropdown';
    case 'dateTime':
      return 'String'; // ISO format
    case 'json':
      return 'Text';
    case 'fixedCollection':
      return 'Text'; // Complex -> JSON string
    case 'collection':
      return 'Text'; // Complex -> JSON string
    default:
      return 'String';
  }
}

/**
 * Convert n8n parameter to operation parameter
 */
export function convertN8nParameter(param: N8nParameter): OperationParameter {
  return {
    name: param.name,
    displayName: param.displayName,
    type: param.type,
    required: param.required ?? false,
    default: param.default,
    description: param.description,
    placeholder: param.placeholder,
    options: param.options?.map(opt => ({
      name: opt.name,
      value: opt.value
    }))
  };
}

/**
 * Convert operation parameter to element template property
 */
export function convertToElementProperty(
  param: OperationParameter,
  group: string = 'input'
): ElementTemplateProperty {
  const elementType = mapN8nTypeToElementType(param.type);

  const property: ElementTemplateProperty = {
    label: param.displayName,
    type: elementType,
    value: `\${${param.name}}`,
    binding: {
      type: 'camunda:inputParameter',
      name: param.name
    },
    group
  };

  if (param.description) {
    property.description = param.description;
  }

  // Handle boolean as dropdown with true/false options
  if (param.type === 'boolean') {
    property.choices = [
      { name: 'True', value: 'true' },
      { name: 'False', value: 'false' }
    ];
    property.value = param.default?.toString() ?? 'false';
  }

  // Handle options type as dropdown
  if (param.type === 'options' && param.options) {
    property.choices = param.options.map(opt => ({
      name: opt.name,
      value: opt.value
    }));
    property.value = param.default ?? param.options[0]?.value ?? '';
  }

  return property;
}

/**
 * Generate payload JSON template from parameters
 */
export function generatePayloadTemplate(parameters: OperationParameter[]): string {
  const payload: Record<string, string> = {};

  for (const param of parameters) {
    payload[param.name] = `\${${param.name}}`;
  }

  return JSON.stringify(payload, null, 2);
}

/**
 * Generate output mapping JSON
 */
export function generateOutputMapping(): string {
  return JSON.stringify({
    success: '$.success',
    statusCode: '$.statusCode',
    error: '$.error'
  }, null, 2);
}

/**
 * Determine category from n8n node metadata
 */
export function determineCategory(nodeName: string, tags?: string[]): string {
  const name = nodeName.toLowerCase();

  // Communication
  if (['slack', 'discord', 'telegram', 'teams', 'whatsapp', 'twilio', 'mattermost'].some(s => name.includes(s))) {
    return 'communication';
  }

  // Email
  if (['email', 'gmail', 'outlook', 'sendgrid', 'mailchimp', 'smtp'].some(s => name.includes(s))) {
    return 'communication';
  }

  // Productivity
  if (['sheets', 'drive', 'notion', 'airtable', 'trello', 'asana', 'monday'].some(s => name.includes(s))) {
    return 'productivity';
  }

  // CRM
  if (['salesforce', 'hubspot', 'pipedrive', 'zoho'].some(s => name.includes(s))) {
    return 'business';
  }

  // Developer
  if (['github', 'gitlab', 'jira', 'linear', 'http', 'webhook', 'api'].some(s => name.includes(s))) {
    return 'developer-tools';
  }

  // Database
  if (['postgres', 'mysql', 'mongodb', 'supabase', 'redis'].some(s => name.includes(s))) {
    return 'data';
  }

  // AI
  if (['openai', 'anthropic', 'ai', 'gpt', 'claude'].some(s => name.includes(s))) {
    return 'ai';
  }

  // Default
  return 'integrations';
}

/**
 * Generate default color based on service
 */
export function getServiceColor(nodeName: string): string {
  const colors: Record<string, string> = {
    slack: '#4A154B',
    discord: '#5865F2',
    telegram: '#0088cc',
    github: '#24292e',
    gitlab: '#FC6D26',
    notion: '#000000',
    airtable: '#18BFFF',
    trello: '#0079BF',
    salesforce: '#00A1E0',
    hubspot: '#FF7A59',
    jira: '#0052CC',
    google: '#4285F4',
    microsoft: '#00A4EF',
    stripe: '#635BFF',
    shopify: '#96BF48',
    openai: '#10a37f',
    anthropic: '#d97757'
  };

  const name = nodeName.toLowerCase();
  for (const [service, color] of Object.entries(colors)) {
    if (name.includes(service)) {
      return color;
    }
  }

  return '#6366f1'; // Default indigo
}

/**
 * Generate tags from node metadata
 */
export function generateTags(nodeName: string, resource: string, operation: string): string[] {
  const tags = new Set<string>();

  // Add node name
  tags.add(nodeName.toLowerCase());

  // Add resource
  if (resource) {
    tags.add(resource.toLowerCase());
  }

  // Add operation
  if (operation) {
    tags.add(operation.toLowerCase());
  }

  // Add category-based tags
  const category = determineCategory(nodeName);
  tags.add(category);

  return Array.from(tags);
}

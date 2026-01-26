"use strict";
/**
 * Type mapping utilities: n8n types -> Catalyst element template types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapN8nTypeToElementType = mapN8nTypeToElementType;
exports.convertN8nParameter = convertN8nParameter;
exports.convertToElementProperty = convertToElementProperty;
exports.generatePayloadTemplate = generatePayloadTemplate;
exports.generateOutputMapping = generateOutputMapping;
exports.determineCategory = determineCategory;
exports.getServiceColor = getServiceColor;
exports.generateTags = generateTags;
/**
 * Map n8n parameter type to element template type
 */
function mapN8nTypeToElementType(n8nType) {
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
function convertN8nParameter(param) {
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
function convertToElementProperty(param, group = 'input') {
    const elementType = mapN8nTypeToElementType(param.type);
    const property = {
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
function generatePayloadTemplate(parameters) {
    const payload = {};
    for (const param of parameters) {
        payload[param.name] = `\${${param.name}}`;
    }
    return JSON.stringify(payload, null, 2);
}
/**
 * Generate output mapping JSON
 */
function generateOutputMapping() {
    return JSON.stringify({
        success: '$.success',
        statusCode: '$.statusCode',
        error: '$.error'
    }, null, 2);
}
/**
 * Determine category from n8n node metadata
 */
function determineCategory(nodeName, tags) {
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
function getServiceColor(nodeName) {
    const colors = {
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
function generateTags(nodeName, resource, operation) {
    const tags = new Set();
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

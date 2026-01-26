"use strict";
/**
 * Element Template Generator
 *
 * Generates Camunda element template JSON from operation schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateElementTemplate = generateElementTemplate;
exports.elementTemplateToJson = elementTemplateToJson;
const naming_1 = require("../utils/naming");
const type_mapper_1 = require("../utils/type-mapper");
// Default SVG icon (layers icon)
const DEFAULT_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 17l10 5 10-5'/%3E%3Cpath d='M2 12l10 5 10-5'/%3E%3C/svg%3E";
/**
 * Generate element template from operation schema
 */
function generateElementTemplate(schema) {
    const connectorId = (0, naming_1.generateConnectorId)(schema.nodeId, schema.resource, schema.operation);
    const templateId = (0, naming_1.generateTemplateId)(connectorId);
    const webhookUrl = (0, naming_1.generateWebhookUrl)(connectorId);
    const properties = [
        // Implementation (hidden, always CatalystBridge)
        {
            label: 'Implementation',
            type: 'String',
            value: 'io.catalyst.bridge.CatalystBridge',
            binding: {
                type: 'property',
                name: 'camunda:class'
            }
        },
        // Connection group
        {
            label: 'n8n Webhook URL',
            type: 'String',
            value: webhookUrl,
            binding: {
                type: 'camunda:inputParameter',
                name: 'webhookUrl'
            },
            group: 'connection',
            constraints: {
                notEmpty: true
            }
        },
        {
            label: 'Timeout (seconds)',
            type: 'String',
            value: '30',
            binding: {
                type: 'camunda:inputParameter',
                name: 'timeout'
            },
            group: 'connection'
        }
    ];
    // Add input parameters from schema
    for (const param of schema.parameters) {
        const elementType = (0, type_mapper_1.mapN8nTypeToElementType)(param.type);
        const property = {
            label: param.displayName,
            type: elementType,
            value: `\${${param.name}}`,
            binding: {
                type: 'camunda:inputParameter',
                name: param.name
            },
            group: 'input'
        };
        if (param.description) {
            property.description = param.description;
        }
        // Handle options/dropdown
        if (param.type === 'options' && param.options) {
            property.choices = param.options.map(opt => ({
                name: opt.name,
                value: opt.value
            }));
            property.value = param.default ?? param.options[0]?.value ?? '';
        }
        // Handle boolean as dropdown
        if (param.type === 'boolean') {
            property.choices = [
                { name: 'True', value: 'true' },
                { name: 'False', value: 'false' }
            ];
            property.value = param.default?.toString() ?? 'false';
        }
        properties.push(property);
    }
    // Add payload
    properties.push({
        label: 'Payload',
        type: 'Text',
        value: (0, type_mapper_1.generatePayloadTemplate)(schema.parameters),
        binding: {
            type: 'camunda:inputParameter',
            name: 'payload'
        },
        group: 'input'
    });
    // Add output mapping
    properties.push({
        label: 'Output Mapping',
        type: 'Text',
        value: (0, type_mapper_1.generateOutputMapping)(),
        binding: {
            type: 'camunda:inputParameter',
            name: 'outputMapping'
        },
        group: 'output'
    });
    return {
        $schema: 'https://unpkg.com/@camunda/element-templates-json-schema/resources/schema.json',
        name: `Catalyst - ${schema.displayName}`,
        id: templateId,
        description: schema.description,
        version: 1,
        appliesTo: ['bpmn:ServiceTask'],
        icon: {
            contents: DEFAULT_ICON
        },
        groups: [
            { id: 'connection', label: 'Connection' },
            { id: 'input', label: 'Input' },
            { id: 'output', label: 'Output' }
        ],
        properties
    };
}
/**
 * Convert element template to JSON string
 */
function elementTemplateToJson(template) {
    return JSON.stringify(template, null, 2);
}

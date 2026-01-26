"use strict";
/**
 * Element Template Generator
 *
 * Generates Camunda element template JSON from operation schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateElementTemplate = generateElementTemplate;
exports.generateMultiOperationElementTemplate = generateMultiOperationElementTemplate;
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
 * Generate multi-operation element template from multi-operation schema
 * Supports conditional properties based on resource/operation selection
 */
function generateMultiOperationElementTemplate(schema) {
    const templateId = (0, naming_1.generateTemplateId)(schema.nodeId);
    const webhookUrl = (0, naming_1.generateWebhookUrl)(schema.nodeId);
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
    // Build groups and properties per operation
    // Strategy: Create one group per operation, with all parameters for that operation
    // When user selects an operation, only that group's parameters will show
    const groups = [
        { id: 'connection', label: 'Connection' },
        { id: 'operation', label: 'Operation' }
    ];
    const allOperations = [];
    for (const resource of schema.resources) {
        for (const operation of resource.operations) {
            const operationValue = `${resource.value}:${operation.value}`;
            allOperations.push({
                name: `${resource.name} - ${operation.name}`,
                value: operationValue,
                resource: resource.value,
                operation: operation.value
            });
            // Create a group for this operation
            groups.push({
                id: `group-${operationValue}`,
                label: `${resource.name} - ${operation.name}`
            });
        }
    }
    // Add output group
    groups.push({ id: 'output', label: 'Output' });
    // Single operation dropdown
    properties.push({
        id: 'operation',
        label: 'Operation',
        type: 'Dropdown',
        value: allOperations[0]?.value || '',
        binding: {
            type: 'camunda:inputParameter',
            name: 'operation'
        },
        group: 'operation',
        choices: allOperations.map(op => ({
            name: op.name,
            value: op.value
        })),
        constraints: {
            notEmpty: true
        }
    });
    // Add parameters for each operation
    for (const resource of schema.resources) {
        for (const operation of resource.operations) {
            const operationValue = `${resource.value}:${operation.value}`;
            const groupId = `group-${operationValue}`;
            // Add all parameters for this operation
            for (const param of operation.parameters) {
                // Determine element type
                // For options type without options array (dynamic options), use String
                let elementType = (0, type_mapper_1.mapN8nTypeToElementType)(param.type);
                if (param.type === 'options' && !param.options) {
                    elementType = 'String';
                }
                const property = {
                    id: `${operationValue}_${param.name}`,
                    label: param.displayName,
                    type: elementType,
                    value: `\${${param.name}}`,
                    binding: {
                        type: 'camunda:inputParameter',
                        name: param.name
                    },
                    group: groupId,
                    condition: {
                        type: 'simple',
                        property: 'operation',
                        equals: operationValue
                    }
                };
                if (param.description) {
                    property.description = param.description;
                }
                if (param.required) {
                    property.constraints = {
                        notEmpty: true
                    };
                }
                // Handle options/dropdown (only if options are provided)
                if (param.type === 'options' && param.options && param.options.length > 0) {
                    property.choices = param.options.map((opt) => ({
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
        }
    }
    // Add dynamic payload
    properties.push({
        label: 'Payload',
        type: 'Text',
        value: generateMultiOperationPayload(schema),
        binding: {
            type: 'camunda:inputParameter',
            name: 'payload'
        },
        group: 'input',
        description: 'Dynamic JSON payload sent to n8n'
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
        groups,
        properties
    };
}
/**
 * Generate dynamic payload template for multi-operation schema
 * Includes all possible parameters with variable substitution
 * Operation format is "resource:operation", so we need to parse it
 */
function generateMultiOperationPayload(schema) {
    // Collect all unique parameter names across all operations
    const allParams = new Set();
    for (const resource of schema.resources) {
        for (const operation of resource.operations) {
            for (const param of operation.parameters) {
                allParams.add(param.name);
            }
        }
    }
    // Build payload object
    // The operation value is "resource:operation", so we parse it
    const payload = {
        resource: '${operation.split(":")[0]}',
        operation: '${operation.split(":")[1]}'
    };
    // Add all parameters as variables
    for (const paramName of Array.from(allParams).sort()) {
        payload[paramName] = `\${${paramName}}`;
    }
    return JSON.stringify(payload, null, 2);
}
/**
 * Convert element template to JSON string
 */
function elementTemplateToJson(template) {
    return JSON.stringify(template, null, 2);
}

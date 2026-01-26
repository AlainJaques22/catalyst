/**
 * Element Template Generator
 *
 * Generates Camunda element template JSON from operation schema
 */

import { OperationSchema, ElementTemplate, ElementTemplateProperty, MultiOperationSchema } from '../types';
import {
  generateConnectorId,
  generateTemplateId,
  generateWebhookUrl,
  toKebabCase
} from '../utils/naming';
import {
  mapN8nTypeToElementType,
  generatePayloadTemplate,
  generateOutputMapping
} from '../utils/type-mapper';

// Default SVG icon (layers icon)
const DEFAULT_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 17l10 5 10-5'/%3E%3Cpath d='M2 12l10 5 10-5'/%3E%3C/svg%3E";

/**
 * Generate element template from operation schema
 */
export function generateElementTemplate(schema: OperationSchema): ElementTemplate {
  const connectorId = generateConnectorId(schema.nodeId, schema.resource, schema.operation);
  const templateId = generateTemplateId(connectorId);
  const webhookUrl = generateWebhookUrl(connectorId);

  const properties: ElementTemplateProperty[] = [
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
      label: '🔗 n8n Webhook URL',
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
      label: '⏱️ Timeout (seconds)',
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
    const elementType = mapN8nTypeToElementType(param.type);

    const property: ElementTemplateProperty = {
      label: `${getFieldIcon(param.name)} ${param.displayName}`,
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

  // Add output mapping
  properties.push({
    label: '📤 Output Mapping',
    type: 'Text',
    value: generateOutputMapping(),
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
      { id: 'connection', label: '⚡ Connection' },
      { id: 'input', label: '📥 Input' },
      { id: 'output', label: '📤 Output' }
    ],
    properties
  };
}

/**
 * Generate multi-operation element template from multi-operation schema
 * Uses simplified payload-only pattern for Camunda 7 compatibility
 * (Conditional properties are Camunda 8 only)
 */
export function generateMultiOperationElementTemplate(schema: MultiOperationSchema): ElementTemplate {
  const templateId = generateTemplateId(schema.nodeId);
  const webhookUrl = generateWebhookUrl(schema.nodeId);

  const properties: ElementTemplateProperty[] = [
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
      label: '🔗 n8n Webhook URL',
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
      label: '⏱️ Timeout (seconds)',
      type: 'String',
      value: '30',
      binding: {
        type: 'camunda:inputParameter',
        name: 'timeout'
      },
      group: 'connection'
    }
  ];

  // Simple groups: Connection, Operation, Input, Output
  const groups: Array<{ id: string; label: string }> = [
    { id: 'connection', label: 'Connection' },
    { id: 'operation', label: 'Operation' },
    { id: 'input', label: 'Input' },
    { id: 'output', label: 'Output' }
  ];

  // Build operation choices
  const allOperations: Array<{ name: string; value: string }> = [];
  for (const resource of schema.resources) {
    for (const operation of resource.operations) {
      const operationValue = `${resource.value}:${operation.value}`;
      allOperations.push({
        name: `${resource.name} - ${operation.name}`,
        value: operationValue
      });
    }
  }

  // Operation dropdown (for reference only)
  properties.push({
    id: 'operation',
    label: 'Operation (Reference)',
    type: 'Dropdown',
    value: allOperations[0]?.value || '',
    binding: {
      type: 'camunda:inputParameter',
      name: 'operation'
    },
    group: 'operation',
    choices: allOperations,
    description: 'Select operation type for reference. Configure actual operation in Payload field below.'
  });

  // Generate payload examples documentation
  const payloadExamples = generatePayloadExamples(schema);

  // Simplified payload-only approach (Camunda 7 compatible)
  // No individual parameter fields - users edit JSON directly
  const defaultPayload = generateDefaultPayload(schema);

  properties.push({
    label: 'Payload',
    type: 'Text',
    value: defaultPayload,
    binding: {
      type: 'camunda:inputParameter',
      name: 'payload'
    },
    group: 'input',
    description: payloadExamples,
    constraints: {
      notEmpty: true
    }
  });

  // Add output mapping
  properties.push({
    label: '📤 Output Mapping',
    type: 'Text',
    value: generateOutputMapping(),
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
 * Generate default payload for the most common operation
 * Uses first operation as default example
 */
function generateDefaultPayload(schema: MultiOperationSchema): string {
  if (schema.resources.length === 0 || schema.resources[0].operations.length === 0) {
    return '{\n  "resource": "message",\n  "operation": "send"\n}';
  }

  const firstResource = schema.resources[0];
  const firstOperation = firstResource.operations[0];

  const payload: Record<string, string> = {
    resource: firstResource.value,
    operation: firstOperation.value
  };

  // Add parameters for first operation as example
  for (const param of firstOperation.parameters.slice(0, 5)) { // Limit to first 5 params
    payload[param.name] = `\${${param.name}}`;
  }

  return JSON.stringify(payload, null, 2);
}

/**
 * Generate payload examples documentation for all operations
 * Shows users how to structure payloads for different operations
 */
function generatePayloadExamples(schema: MultiOperationSchema): string {
  const examples: string[] = [
    'JSON payload sent to n8n. Use ${variableName} syntax for process variables.',
    '',
    'Common Examples:',
    ''
  ];

  // Group operations by resource
  for (const resource of schema.resources) {
    examples.push(`=== ${resource.name} ===`);
    examples.push('');

    // Show first 3 operations per resource as examples
    for (const operation of resource.operations.slice(0, 3)) {
      examples.push(`${operation.name}:`);

      const examplePayload: Record<string, string> = {
        resource: resource.value,
        operation: operation.value
      };

      // Add key parameters (first 3)
      for (const param of operation.parameters.slice(0, 3)) {
        if (param.required || operation.parameters.indexOf(param) < 2) {
          examplePayload[param.name] = `\${${param.name}}`;
        }
      }

      examples.push(JSON.stringify(examplePayload, null, 2));
      examples.push('');
    }

    if (resource.operations.length > 3) {
      examples.push(`... and ${resource.operations.length - 3} more operations`);
      examples.push('');
    }
  }

  examples.push('Edit the payload JSON above to match your operation.');

  return examples.join('\n');
}

/**
 * Get icon for a field based on its name
 */
function getFieldIcon(fieldName: string): string {
  const name = fieldName.toLowerCase();

  // Email related
  if (name.includes('email') || name.includes('to') || name.includes('from') || name.includes('cc') || name.includes('bcc')) {
    return '✉️';
  }

  // Subject
  if (name.includes('subject') || name.includes('title')) {
    return '📝';
  }

  // Message/Body/Content
  if (name.includes('message') || name.includes('body') || name.includes('content') || name.includes('text')) {
    return '💬';
  }

  // IDs
  if (name.includes('id') && !name.includes('label')) {
    return '🔑';
  }

  // Labels
  if (name.includes('label')) {
    return '🏷️';
  }

  // Thread
  if (name.includes('thread')) {
    return '🧵';
  }

  // Draft
  if (name.includes('draft')) {
    return '📄';
  }

  // Attachments
  if (name.includes('attach') || name.includes('file')) {
    return '📎';
  }

  // Options/Settings
  if (name.includes('option') || name.includes('setting') || name.includes('config')) {
    return '⚙️';
  }

  // Format/Type
  if (name.includes('format') || name.includes('type')) {
    return '🎨';
  }

  // URL/Link
  if (name.includes('url') || name.includes('link')) {
    return '🔗';
  }

  // Date/Time
  if (name.includes('date') || name.includes('time')) {
    return '📅';
  }

  // Name
  if (name.includes('name')) {
    return '🏷️';
  }

  // Filter/Search/Query
  if (name.includes('filter') || name.includes('search') || name.includes('query')) {
    return '🔍';
  }

  // Status/State
  if (name.includes('status') || name.includes('state')) {
    return '📊';
  }

  // Simple/Simplify
  if (name.includes('simple')) {
    return '✨';
  }

  // Default
  return '📋';
}

/**
 * Convert element template to JSON string
 */
export function elementTemplateToJson(template: ElementTemplate): string {
  return JSON.stringify(template, null, 2);
}

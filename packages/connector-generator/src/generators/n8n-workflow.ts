/**
 * n8n Workflow Generator
 *
 * Generates n8n webhook workflow JSON from operation schema
 */

import { OperationSchema, N8nWorkflow, N8nWorkflowNode, MultiOperationSchema } from '../types';
import {
  generateConnectorId,
  generateWebhookPath,
  toTitleCase
} from '../utils/naming';

/**
 * Generate a unique ID for n8n nodes
 */
function generateNodeId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Node-specific typeVersion mapping
 * Each n8n node has specific supported versions
 */
const NODE_TYPE_VERSIONS: Record<string, number> = {
  slack: 2.2,
  gmail: 2.1,
  googleSheets: 4.5,
  notion: 2.2,
  airtable: 2.1,
  discord: 2.1,
  telegram: 1.2,
  // Default for unknown nodes
  default: 1
};

/**
 * Get the correct typeVersion for a node
 */
function getNodeTypeVersion(nodeId: string): number {
  return NODE_TYPE_VERSIONS[nodeId] ?? NODE_TYPE_VERSIONS.default;
}

/**
 * Build node-specific parameters for Gmail
 */
function buildGmailParams(schema: OperationSchema): Record<string, any> {
  const params: Record<string, any> = {};

  if (schema.operation === 'send') {
    params.sendTo = '={{ $json.body.to }}';
    params.subject = '={{ $json.body.subject }}';
    params.emailType = 'text';
    params.message = '={{ $json.body.message }}';

    // Optional CC/BCC
    params.options = {
      ccList: '={{ $json.body.cc }}',
      bccList: '={{ $json.body.bcc }}'
    };
  }

  return params;
}

/**
 * Build node-specific parameters for Slack
 */
function buildSlackParams(schema: OperationSchema): Record<string, any> {
  const params: Record<string, any> = {};

  if (schema.operation === 'send') {
    params.select = 'channel';
    params.channelId = {
      __rl: true,
      value: '={{ $json.body.channel }}',
      mode: 'id'
    };
    params.text = '={{ $json.body.text }}';
    params.otherOptions = {};
  }

  return params;
}

/**
 * Build service node parameters based on node type
 */
function buildServiceParams(schema: OperationSchema): Record<string, any> {
  // Node-specific parameter builders
  switch (schema.nodeId) {
    case 'gmail':
      return buildGmailParams(schema);
    case 'slack':
      return buildSlackParams(schema);
    default:
      // Generic parameter mapping
      return buildGenericParams(schema);
  }
}

/**
 * Build generic parameters for unknown nodes
 */
function buildGenericParams(schema: OperationSchema): Record<string, any> {
  const params: Record<string, any> = {};

  // Add resource and operation if applicable
  if (schema.resource) {
    params.resource = schema.resource;
  }
  if (schema.operation) {
    params.operation = schema.operation;
  }

  // Map parameters to n8n expressions
  for (const param of schema.parameters) {
    params[param.name] = `={{ $json.body.${param.name} }}`;
  }

  return params;
}

/**
 * Generate n8n workflow from operation schema
 */
export function generateN8nWorkflow(schema: OperationSchema): N8nWorkflow {
  const connectorId = generateConnectorId(schema.nodeId, schema.resource, schema.operation);
  const webhookPath = generateWebhookPath(connectorId);
  const operationNodeName = `${toTitleCase(schema.operation)} ${toTitleCase(schema.resource)}`;

  // Build the service node parameters using node-specific logic
  const serviceParams = buildServiceParams(schema);

  // Webhook node
  const webhookNode: N8nWorkflowNode = {
    parameters: {
      httpMethod: 'POST',
      path: webhookPath,
      responseMode: 'responseNode',
      options: {}
    },
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2.1,
    position: [0, 0],
    id: 'webhook-1',
    name: 'Webhook',
    webhookId: webhookPath
  };

  // Service node (the actual n8n integration)
  const serviceNode: N8nWorkflowNode = {
    parameters: serviceParams,
    type: `n8n-nodes-base.${schema.nodeId}`,
    typeVersion: getNodeTypeVersion(schema.nodeId),
    position: [220, 0],
    id: generateNodeId(),
    name: operationNodeName
    // Note: credentials are NOT included - user configures in n8n
  };

  // Error format node (catches errors from service node)
  const errorFormatNode: N8nWorkflowNode = {
    parameters: {
      jsCode: `// Format error response for connector failure
const error = $input.item.json.error || $input.item.json;

let errorMessage = 'Configuration needed. Please check node settings in n8n.';
if (error.message) {
  errorMessage = error.message;
}

return {
  json: {
    success: false,
    statusCode: 500,
    error: errorMessage,
    responseBody: null
  }
};`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [440, 100],
    id: 'error-format-1',
    name: 'Format Error Response'
  };

  // Response node
  const responseNode: N8nWorkflowNode = {
    parameters: {
      respondWith: 'json',
      responseBody: '={{ { success: true, statusCode: 200, responseBody: $json, error: null } }}'
    },
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.1,
    position: [660, 0],
    id: 'respond-1',
    name: 'Respond to Webhook'
  };

  return {
    name: schema.displayName,
    nodes: [webhookNode, serviceNode, errorFormatNode, responseNode],
    connections: {
      'Webhook': {
        main: [[{ node: operationNodeName, type: 'main', index: 0 }]]
      },
      [operationNodeName]: {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]],
        error: [[{ node: 'Format Error Response', type: 'main', index: 0 }]]
      },
      'Format Error Response': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]]
      }
    },
    active: true,
    settings: {
      executionOrder: 'v1'
    },
    meta: {
      description: `Catalyst connector webhook for ${schema.displayName}. Configure credentials in n8n after importing.`
    }
  };
}

/**
 * Generate simplified n8n workflow that matches existing Slack pattern
 * This matches the manually created slack-send-message.n8n.json format
 */
export function generateSlackStyleWorkflow(schema: OperationSchema): N8nWorkflow {
  const connectorId = generateConnectorId(schema.nodeId, schema.resource, schema.operation);
  const webhookPath = generateWebhookPath(connectorId);

  // Webhook node
  const webhookNode: N8nWorkflowNode = {
    parameters: {
      httpMethod: 'POST',
      path: webhookPath,
      responseMode: 'responseNode',
      options: {}
    },
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2.1,
    position: [0, 0],
    id: 'webhook-1',
    name: 'Webhook',
    webhookId: webhookPath
  };

  // For Slack specifically, match the existing format
  const serviceNode: N8nWorkflowNode = {
    parameters: {
      select: 'channel',
      channelId: {
        __rl: true,
        value: '={{ $json.channel }}',
        mode: 'id'
      },
      text: '={{ $json.text }}',
      otherOptions: {}
    },
    type: 'n8n-nodes-base.slack',
    typeVersion: 2.4,
    position: [220, 0],
    id: generateNodeId(),
    name: 'Send a message'
    // credentials configured by user in n8n
  };

  // Error format node (catches errors from service node)
  const errorFormatNode: N8nWorkflowNode = {
    parameters: {
      jsCode: `// Format error response for connector failure
const error = $input.item.json.error || $input.item.json;

let errorMessage = 'Configuration needed. Please check node settings in n8n.';
if (error.message) {
  errorMessage = error.message;
}

return {
  json: {
    success: false,
    statusCode: 500,
    error: errorMessage,
    responseBody: null
  }
};`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [440, 100],
    id: 'error-format-1',
    name: 'Format Error Response'
  };

  // Response node
  const responseNode: N8nWorkflowNode = {
    parameters: {
      respondWith: 'json',
      responseBody: '={{ { success: true, statusCode: 200, responseBody: $json, error: null } }}'
    },
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.1,
    position: [660, 0],
    id: 'respond-1',
    name: 'Respond to Webhook'
  };

  return {
    name: schema.displayName,
    nodes: [webhookNode, serviceNode, errorFormatNode, responseNode],
    connections: {
      'Webhook': {
        main: [[{ node: 'Send a message', type: 'main', index: 0 }]]
      },
      'Send a message': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]],
        error: [[{ node: 'Format Error Response', type: 'main', index: 0 }]]
      },
      'Format Error Response': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]]
      }
    },
    active: true,
    settings: {
      executionOrder: 'v1'
    },
    meta: {
      description: 'Production webhook version for Camunda integration.'
    }
  };
}

/**
 * Generate multi-operation n8n workflow template
 * Creates ONE simple template workflow that users configure in n8n UI
 *
 * User workflow:
 * 1. Import this template into n8n
 * 2. Click on the service node (e.g., Gmail)
 * 3. Select Resource from dropdown (Message, Draft, Label, Thread)
 * 4. Select Operation from dropdown (send, get, reply, etc.)
 * 5. n8n automatically shows relevant fields for selected operation
 * 6. Variables are already pre-mapped ({{ $json.body.to }}, etc.)
 * 7. Configure OAuth credentials
 * 8. Save and activate workflow
 */
export function generateMultiOperationWorkflow(schema: MultiOperationSchema): N8nWorkflow {
  const webhookPath = generateWebhookPath(schema.nodeId);

  // Collect ALL possible parameters across all operations
  const allParameters = new Set<string>();
  for (const resource of schema.resources) {
    for (const operation of resource.operations) {
      for (const param of operation.parameters) {
        allParameters.add(param.name);
      }
    }
  }

  // Webhook node
  const webhookNode: N8nWorkflowNode = {
    parameters: {
      httpMethod: 'POST',
      path: webhookPath,
      responseMode: 'responseNode',
      options: {}
    },
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2.1,
    position: [0, 0],
    id: 'webhook-1',
    name: 'Webhook',
    webhookId: webhookPath
  };

  // Service node (unconfigured - user selects resource/operation)
  // Pre-map ALL parameters so n8n shows them when relevant
  const serviceParams: Record<string, any> = {
    // User will select these in n8n UI:
    // resource: ''
    // operation: ''
  };

  // Pre-map all possible parameters
  // n8n will only show relevant ones based on resource/operation selection
  for (const paramName of Array.from(allParameters).sort()) {
    serviceParams[paramName] = `={{ $json.body.${paramName} }}`;
  }

  const serviceNode: N8nWorkflowNode = {
    parameters: serviceParams,
    type: `n8n-nodes-base.${schema.nodeId}`,
    typeVersion: getNodeTypeVersion(schema.nodeId),
    position: [300, 0],
    id: generateNodeId(),
    name: schema.nodeName
    // Note: User configures credentials and resource/operation in n8n
  };

  // Error format node
  const errorFormatNode: N8nWorkflowNode = {
    parameters: {
      jsCode: `// Format error response
const error = $input.item.json.error || $input.item.json;

let errorMessage = 'Connector not configured. Please:
1. Open the ${schema.nodeName} node in n8n
2. Select a Resource (${schema.resources.map(r => r.name).join(', ')})
3. Select an Operation
4. Configure OAuth credentials
5. Save and activate workflow';

if (error.message) {
  errorMessage = error.message;
}

return {
  json: {
    success: false,
    statusCode: 500,
    error: errorMessage,
    responseBody: null
  }
};`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [520, 100],
    id: 'error-format-1',
    name: 'Format Error Response'
  };

  // Response node
  const responseNode: N8nWorkflowNode = {
    parameters: {
      respondWith: 'json',
      responseBody: '={{ { success: true, statusCode: 200, responseBody: $json, error: null } }}'
    },
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.1,
    position: [740, 0],
    id: 'respond-1',
    name: 'Respond to Webhook'
  };

  return {
    name: `Catalyst ${schema.displayName} Template`,
    nodes: [webhookNode, serviceNode, errorFormatNode, responseNode],
    connections: {
      'Webhook': {
        main: [[{ node: schema.nodeName, type: 'main', index: 0 }]]
      },
      [schema.nodeName]: {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]],
        error: [[{ node: 'Format Error Response', type: 'main', index: 0 }]]
      },
      'Format Error Response': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]]
      }
    },
    active: false, // User activates after configuration
    settings: {
      executionOrder: 'v1'
    },
    meta: {
      description: `Catalyst ${schema.displayName} Template - Configure resource, operation, and credentials in n8n after importing. Supports ${schema.resources.length} resources with ${countTotalOperations(schema)} operations.`
    }
  };
}

/**
 * Count total operations across all resources
 */
function countTotalOperations(schema: MultiOperationSchema): number {
  return schema.resources.reduce((sum, r) => sum + r.operations.length, 0);
}

/**
 * Convert n8n workflow to JSON string
 */
export function n8nWorkflowToJson(workflow: N8nWorkflow): string {
  return JSON.stringify(workflow, null, 2);
}

"use strict";
/**
 * n8n Workflow Generator
 *
 * Generates n8n webhook workflow JSON from operation schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateN8nWorkflow = generateN8nWorkflow;
exports.generateSlackStyleWorkflow = generateSlackStyleWorkflow;
exports.n8nWorkflowToJson = n8nWorkflowToJson;
const naming_1 = require("../utils/naming");
/**
 * Generate a unique ID for n8n nodes
 */
function generateNodeId() {
    return Math.random().toString(36).substring(2, 15);
}
/**
 * Node-specific typeVersion mapping
 * Each n8n node has specific supported versions
 */
const NODE_TYPE_VERSIONS = {
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
function getNodeTypeVersion(nodeId) {
    return NODE_TYPE_VERSIONS[nodeId] ?? NODE_TYPE_VERSIONS.default;
}
/**
 * Build node-specific parameters for Gmail
 */
function buildGmailParams(schema) {
    const params = {};
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
function buildSlackParams(schema) {
    const params = {};
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
function buildServiceParams(schema) {
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
function buildGenericParams(schema) {
    const params = {};
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
function generateN8nWorkflow(schema) {
    const connectorId = (0, naming_1.generateConnectorId)(schema.nodeId, schema.resource, schema.operation);
    const webhookPath = (0, naming_1.generateWebhookPath)(connectorId);
    const operationNodeName = `${(0, naming_1.toTitleCase)(schema.operation)} ${(0, naming_1.toTitleCase)(schema.resource)}`;
    // Build the service node parameters using node-specific logic
    const serviceParams = buildServiceParams(schema);
    // Webhook node
    const webhookNode = {
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
    const serviceNode = {
        parameters: serviceParams,
        type: `n8n-nodes-base.${schema.nodeId}`,
        typeVersion: getNodeTypeVersion(schema.nodeId),
        position: [220, 0],
        id: generateNodeId(),
        name: operationNodeName
        // Note: credentials are NOT included - user configures in n8n
    };
    // Error format node (catches errors from service node)
    const errorFormatNode = {
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
    const responseNode = {
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
function generateSlackStyleWorkflow(schema) {
    const connectorId = (0, naming_1.generateConnectorId)(schema.nodeId, schema.resource, schema.operation);
    const webhookPath = (0, naming_1.generateWebhookPath)(connectorId);
    // Webhook node
    const webhookNode = {
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
    const serviceNode = {
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
    const errorFormatNode = {
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
    const responseNode = {
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
 * Convert n8n workflow to JSON string
 */
function n8nWorkflowToJson(workflow) {
    return JSON.stringify(workflow, null, 2);
}

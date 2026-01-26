"use strict";
/**
 * Schema Extractor
 *
 * Entry point for extracting n8n node schemas.
 * Currently uses static schemas, but will be extended to parse
 * n8n-nodes-base TypeScript files dynamically.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmailSendEmailSchema = exports.slackSendMessageSchema = void 0;
exports.getNodeOperations = getNodeOperations;
exports.getNodeOperation = getNodeOperation;
exports.listAvailableNodes = listAvailableNodes;
exports.listNodeOperations = listNodeOperations;
exports.nodeExists = nodeExists;
const slack_schema_1 = require("./slack-schema");
Object.defineProperty(exports, "slackSendMessageSchema", { enumerable: true, get: function () { return slack_schema_1.slackSendMessageSchema; } });
const gmail_schema_1 = require("./gmail-schema");
Object.defineProperty(exports, "gmailSendEmailSchema", { enumerable: true, get: function () { return gmail_schema_1.gmailSendEmailSchema; } });
// Registry of available node schemas (static for now)
const nodeRegistry = {
    slack: {
        getAll: slack_schema_1.getAllSlackOperations,
        get: slack_schema_1.getSlackOperation
    },
    gmail: {
        getAll: gmail_schema_1.getAllGmailOperations,
        get: gmail_schema_1.getGmailOperation
    }
};
/**
 * Get all operations for a node
 */
function getNodeOperations(nodeId) {
    const node = nodeRegistry[nodeId.toLowerCase()];
    if (!node) {
        throw new Error(`Node '${nodeId}' not found. Available nodes: ${Object.keys(nodeRegistry).join(', ')}`);
    }
    return node.getAll();
}
/**
 * Get a specific operation for a node
 */
function getNodeOperation(nodeId, operation) {
    const node = nodeRegistry[nodeId.toLowerCase()];
    if (!node) {
        throw new Error(`Node '${nodeId}' not found. Available nodes: ${Object.keys(nodeRegistry).join(', ')}`);
    }
    const schema = node.get(operation);
    if (!schema) {
        const available = node.getAll().map(op => op.operation);
        throw new Error(`Operation '${operation}' not found for node '${nodeId}'. Available operations: ${available.join(', ')}`);
    }
    return schema;
}
/**
 * List all available nodes
 */
function listAvailableNodes() {
    return Object.keys(nodeRegistry);
}
/**
 * List all operations for a node
 */
function listNodeOperations(nodeId) {
    const node = nodeRegistry[nodeId.toLowerCase()];
    if (!node) {
        throw new Error(`Node '${nodeId}' not found.`);
    }
    return node.getAll().map(op => op.operation);
}
/**
 * Check if a node exists
 */
function nodeExists(nodeId) {
    return nodeId.toLowerCase() in nodeRegistry;
}

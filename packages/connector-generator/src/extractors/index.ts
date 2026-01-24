/**
 * Schema Extractor
 *
 * Entry point for extracting n8n node schemas.
 * Currently uses static schemas, but will be extended to parse
 * n8n-nodes-base TypeScript files dynamically.
 */

import { OperationSchema } from '../types';
import { slackSendMessageSchema, getAllSlackOperations, getSlackOperation } from './slack-schema';
import { gmailSendEmailSchema, getAllGmailOperations, getGmailOperation } from './gmail-schema';

// Registry of available node schemas (static for now)
const nodeRegistry: Record<string, {
  getAll: () => OperationSchema[];
  get: (operation: string) => OperationSchema | undefined;
}> = {
  slack: {
    getAll: getAllSlackOperations,
    get: getSlackOperation
  },
  gmail: {
    getAll: getAllGmailOperations,
    get: getGmailOperation
  }
};

/**
 * Get all operations for a node
 */
export function getNodeOperations(nodeId: string): OperationSchema[] {
  const node = nodeRegistry[nodeId.toLowerCase()];
  if (!node) {
    throw new Error(`Node '${nodeId}' not found. Available nodes: ${Object.keys(nodeRegistry).join(', ')}`);
  }
  return node.getAll();
}

/**
 * Get a specific operation for a node
 */
export function getNodeOperation(nodeId: string, operation: string): OperationSchema {
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
export function listAvailableNodes(): string[] {
  return Object.keys(nodeRegistry);
}

/**
 * List all operations for a node
 */
export function listNodeOperations(nodeId: string): string[] {
  const node = nodeRegistry[nodeId.toLowerCase()];
  if (!node) {
    throw new Error(`Node '${nodeId}' not found.`);
  }
  return node.getAll().map(op => op.operation);
}

/**
 * Check if a node exists
 */
export function nodeExists(nodeId: string): boolean {
  return nodeId.toLowerCase() in nodeRegistry;
}

// Re-export for convenience
export { slackSendMessageSchema };
export { gmailSendEmailSchema };

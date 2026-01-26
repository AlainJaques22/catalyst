/**
 * Schema Extractor
 *
 * Entry point for extracting n8n node schemas.
 * Currently uses static schemas, but will be extended to parse
 * n8n-nodes-base TypeScript files dynamically.
 */
import { OperationSchema } from '../types';
import { slackSendMessageSchema } from './slack-schema';
import { gmailSendEmailSchema } from './gmail-schema';
/**
 * Get all operations for a node
 */
export declare function getNodeOperations(nodeId: string): OperationSchema[];
/**
 * Get a specific operation for a node
 */
export declare function getNodeOperation(nodeId: string, operation: string): OperationSchema;
/**
 * List all available nodes
 */
export declare function listAvailableNodes(): string[];
/**
 * List all operations for a node
 */
export declare function listNodeOperations(nodeId: string): string[];
/**
 * Check if a node exists
 */
export declare function nodeExists(nodeId: string): boolean;
export { slackSendMessageSchema };
export { gmailSendEmailSchema };

/**
 * N8n Schema Extractor
 *
 * Dynamically extracts operation schemas from n8n node definitions
 * by loading compiled JavaScript modules at runtime.
 */
import { MultiOperationSchema, OperationParameter } from '../types';
/**
 * Extract complete multi-operation schema from n8n node
 *
 * @param nodeId - Node identifier (e.g., 'gmail', 'slack')
 * @returns Complete schema with all resources and operations
 */
export declare function extractN8nNodeSchema(nodeId: string): Promise<MultiOperationSchema>;
/**
 * Classify operation quality tier based on parameter complexity
 */
export declare function classifyOperationTier(parameters: OperationParameter[]): 1 | 2 | 3;

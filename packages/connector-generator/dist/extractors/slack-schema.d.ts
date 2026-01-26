/**
 * Static Slack node schema
 *
 * This represents the extracted schema from n8n's Slack node.
 * In production, this would be dynamically parsed from n8n-nodes-base.
 */
import { OperationSchema } from '../types';
/**
 * Slack Send Message operation schema
 * Extracted from n8n-nodes-base Slack node
 */
export declare const slackSendMessageSchema: OperationSchema;
/**
 * Slack Post Message operation schema (alternative naming)
 */
export declare const slackPostMessageSchema: OperationSchema;
/**
 * All available Slack operations
 */
export declare const slackOperations: OperationSchema[];
/**
 * Get Slack operation schema by operation name
 */
export declare function getSlackOperation(operation: string): OperationSchema | undefined;
/**
 * Get all Slack operations
 */
export declare function getAllSlackOperations(): OperationSchema[];

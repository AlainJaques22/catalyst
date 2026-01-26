/**
 * Static Gmail node schema
 *
 * This represents the extracted schema from n8n's Gmail node.
 * In production, this would be dynamically parsed from n8n-nodes-base.
 */
import { OperationSchema } from '../types';
/**
 * Gmail Send Email operation schema
 * Extracted from n8n-nodes-base Gmail node
 */
export declare const gmailSendEmailSchema: OperationSchema;
/**
 * Gmail Get Email operation schema
 */
export declare const gmailGetEmailSchema: OperationSchema;
/**
 * Gmail Reply to Email operation schema
 */
export declare const gmailReplySchema: OperationSchema;
/**
 * Gmail Add Label operation schema
 */
export declare const gmailAddLabelSchema: OperationSchema;
/**
 * All available Gmail operations
 */
export declare const gmailOperations: OperationSchema[];
/**
 * Get Gmail operation schema by operation name
 */
export declare function getGmailOperation(operation: string): OperationSchema | undefined;
/**
 * Get all Gmail operations
 */
export declare function getAllGmailOperations(): OperationSchema[];

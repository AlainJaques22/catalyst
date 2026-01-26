/**
 * n8n Workflow Generator
 *
 * Generates n8n webhook workflow JSON from operation schema
 */
import { OperationSchema, N8nWorkflow } from '../types';
/**
 * Generate n8n workflow from operation schema
 */
export declare function generateN8nWorkflow(schema: OperationSchema): N8nWorkflow;
/**
 * Generate simplified n8n workflow that matches existing Slack pattern
 * This matches the manually created slack-send-message.n8n.json format
 */
export declare function generateSlackStyleWorkflow(schema: OperationSchema): N8nWorkflow;
/**
 * Convert n8n workflow to JSON string
 */
export declare function n8nWorkflowToJson(workflow: N8nWorkflow): string;

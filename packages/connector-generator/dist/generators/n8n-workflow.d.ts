/**
 * n8n Workflow Generator
 *
 * Generates n8n webhook workflow JSON from operation schema
 */
import { OperationSchema, N8nWorkflow, MultiOperationSchema } from '../types';
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
export declare function generateMultiOperationWorkflow(schema: MultiOperationSchema): N8nWorkflow;
/**
 * Convert n8n workflow to JSON string
 */
export declare function n8nWorkflowToJson(workflow: N8nWorkflow): string;

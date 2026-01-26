import { type Response } from 'express';
import { type NodeTypeAndVersion, type IWebhookFunctions, type FormFieldsParameter, type IWebhookResponseData } from 'n8n-workflow';
export declare const renderFormNode: (context: IWebhookFunctions, res: Response, trigger: NodeTypeAndVersion, fields: FormFieldsParameter, mode: "test" | "production") => Promise<IWebhookResponseData>;
/**
 * Retrieves the active Form Trigger node from the workflow's parent nodes.
 *
 * This function searches through the parent nodes to find Form Trigger nodes,
 * then determines which one has been executed.
 *
 * @returns The NodeTypeAndVersion object representing the active Form Trigger node
 * @throws {NodeOperationError} When no Form Trigger node is found in parent nodes
 * @throws {NodeOperationError} When Form Trigger node exists but was not executed
 */
export declare function getFormTriggerNode(context: IWebhookFunctions): NodeTypeAndVersion;
//# sourceMappingURL=formNodeUtils.d.ts.map
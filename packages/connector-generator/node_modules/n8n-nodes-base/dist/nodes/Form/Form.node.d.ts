import type { IExecuteFunctions, INodeExecutionData, INodeProperties, INodeTypeDescription, IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
import { Node } from 'n8n-workflow';
export declare const formFieldsProperties: INodeProperties[];
export declare class Form extends Node {
    nodeInputData: INodeExecutionData[];
    description: INodeTypeDescription;
    webhook(context: IWebhookFunctions): Promise<IWebhookResponseData>;
    execute(context: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Form.node.d.ts.map
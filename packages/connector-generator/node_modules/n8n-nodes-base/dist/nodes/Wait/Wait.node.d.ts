import type { IExecuteFunctions, INodeExecutionData, INodeTypeDescription, IWebhookFunctions } from 'n8n-workflow';
import { Webhook } from '../Webhook/Webhook.node';
export declare class Wait extends Webhook {
    authPropertyName: string;
    description: INodeTypeDescription;
    webhook(context: IWebhookFunctions): Promise<import("n8n-workflow").IWebhookResponseData>;
    execute(context: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    private configureAndPutToWait;
    private putToWait;
}
//# sourceMappingURL=Wait.node.d.ts.map
import { type INodeType, type INodeTypeBaseDescription, type INodeTypeDescription, type IWebhookFunctions } from 'n8n-workflow';
export declare class FormTriggerV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    webhook(this: IWebhookFunctions): Promise<{
        noWebhookResponse: boolean;
        webhookResponse?: undefined;
        workflowData?: undefined;
    } | {
        webhookResponse: {
            status: number;
        };
        workflowData: import("n8n-workflow").INodeExecutionData[][];
        noWebhookResponse?: undefined;
    }>;
}
//# sourceMappingURL=FormTriggerV1.node.d.ts.map
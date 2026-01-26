import { type IHookFunctions, type IWebhookFunctions, type INodeType, type INodeTypeDescription, type IWebhookResponseData, type INodeTypeBaseDescription } from 'n8n-workflow';
export declare class MailerLiteTriggerV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
//# sourceMappingURL=MailerLiteTriggerV1.node.d.ts.map
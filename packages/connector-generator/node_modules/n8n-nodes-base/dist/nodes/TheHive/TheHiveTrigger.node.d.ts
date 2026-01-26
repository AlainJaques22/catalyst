import { type IWebhookFunctions, type IHookFunctions, type INodeType, type INodeTypeDescription, type IWebhookResponseData } from 'n8n-workflow';
export declare class TheHiveTrigger implements INodeType {
    description: INodeTypeDescription;
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
//# sourceMappingURL=TheHiveTrigger.node.d.ts.map
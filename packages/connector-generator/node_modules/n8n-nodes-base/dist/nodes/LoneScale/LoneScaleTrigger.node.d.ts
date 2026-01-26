import { type IHookFunctions, type ILoadOptionsFunctions, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type IWebhookFunctions, type IWebhookResponseData } from 'n8n-workflow';
export declare class LoneScaleTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getWorkflows(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
//# sourceMappingURL=LoneScaleTrigger.node.d.ts.map
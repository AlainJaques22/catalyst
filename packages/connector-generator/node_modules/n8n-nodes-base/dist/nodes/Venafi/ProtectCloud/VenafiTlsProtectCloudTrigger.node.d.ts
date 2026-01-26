import { type IHookFunctions, type ILoadOptionsFunctions, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type IWebhookFunctions, type IWebhookResponseData } from 'n8n-workflow';
export declare class VenafiTlsProtectCloudTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getActivityTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getActivitySubTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
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
//# sourceMappingURL=VenafiTlsProtectCloudTrigger.node.d.ts.map
import { type IHookFunctions, type IWebhookFunctions, type ILoadOptionsFunctions, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type IWebhookResponseData } from 'n8n-workflow';
export declare class LinearTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
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
//# sourceMappingURL=LinearTrigger.node.d.ts.map
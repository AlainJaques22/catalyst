import { type ILoadOptionsFunctions, type INodeListSearchResult, type INodePropertyOptions, type IHookFunctions, type IWebhookFunctions, type INodeType, type INodeTypeDescription, type IWebhookResponseData } from 'n8n-workflow';
export declare class SlackTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            getChannels(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
        };
        loadOptions: {
            getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
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
//# sourceMappingURL=SlackTrigger.node.d.ts.map
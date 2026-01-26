import { type IHookFunctions, type ILoadOptionsFunctions, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type IWebhookFunctions, type IWebhookResponseData } from 'n8n-workflow';
import { emeliaApiTest } from './GenericFunctions';
export declare class EmeliaTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            emeliaApiTest: typeof emeliaApiTest;
        };
        loadOptions: {
            getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
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
//# sourceMappingURL=EmeliaTrigger.node.d.ts.map
import type { INodeType, INodeTypeDescription, IHookFunctions, IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
import { listSearch } from './v2/methods';
export declare class MicrosoftTeamsTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: typeof listSearch;
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
//# sourceMappingURL=MicrosoftTeamsTrigger.node.d.ts.map
import { type IHookFunctions, type IWebhookFunctions, type INodeType, type INodeTypeDescription, type IWebhookResponseData, type INodeTypeBaseDescription } from 'n8n-workflow';
import { getSites } from '../GenericFunctions';
export declare class WebflowTriggerV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getSites: typeof getSites;
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
//# sourceMappingURL=WebflowTriggerV1.node.d.ts.map
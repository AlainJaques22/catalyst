import { type IHookFunctions, type IWebhookFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type ILoadOptionsFunctions, type INodeCredentialTestResult, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type IWebhookResponseData } from 'n8n-workflow';
export declare class BitbucketTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            bitbucketApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
        loadOptions: {
            getWorkspaceEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getRepositoriesEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getRepositories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
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
//# sourceMappingURL=BitbucketTrigger.node.d.ts.map
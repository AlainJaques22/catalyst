import { type IExecuteFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type ILoadOptionsFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class HomeAssistant implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            homeAssistantApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
        loadOptions: {
            getAllEntities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getCameraEntities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getDomains(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getDomainServices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=HomeAssistant.node.d.ts.map
import { type IExecuteFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type ILoadOptionsFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class HaloPSA implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getHaloPSASites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getHaloPSAClients(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getHaloPSATicketsTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getHaloPSAAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
        credentialTest: {
            haloPSAApiCredentialTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=HaloPSA.node.d.ts.map
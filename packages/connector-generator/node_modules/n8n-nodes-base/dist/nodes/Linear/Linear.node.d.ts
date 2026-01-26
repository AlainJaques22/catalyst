import { type IExecuteFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type ILoadOptionsFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Linear implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            linearApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
        loadOptions: {
            getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getStates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Linear.node.d.ts.map
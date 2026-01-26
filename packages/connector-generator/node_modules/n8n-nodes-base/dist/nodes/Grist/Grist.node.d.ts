import { type IExecuteFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type ILoadOptionsFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Grist implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getTableColumns(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
        };
        credentialTest: {
            gristApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Grist.node.d.ts.map
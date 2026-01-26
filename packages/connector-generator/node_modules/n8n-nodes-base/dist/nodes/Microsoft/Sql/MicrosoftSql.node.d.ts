import { type IExecuteFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class MicrosoftSql implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            microsoftSqlConnectionTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=MicrosoftSql.node.d.ts.map
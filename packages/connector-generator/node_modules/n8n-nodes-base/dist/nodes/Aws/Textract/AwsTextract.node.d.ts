import { type ICredentialsDecrypted, type ICredentialTestFunctions, type IExecuteFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class AwsTextract implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            awsTextractApiCredentialTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=AwsTextract.node.d.ts.map
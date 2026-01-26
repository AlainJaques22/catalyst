import { type IExecuteFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Dhl implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            dhlApiCredentialTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Dhl.node.d.ts.map
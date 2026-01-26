import { type IExecuteFunctions, type ICredentialsDecrypted, type ICredentialTestFunctions, type INodeCredentialTestResult, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Mqtt implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            mqttConnectionTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Mqtt.node.d.ts.map
import type { IExecuteFunctions, ICredentialsDecrypted, ICredentialTestFunctions, ILoadOptionsFunctions, INodeCredentialTestResult, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { sendAndWaitWebhook } from '../../../utils/sendAndWait/utils';
export declare class GoogleChat implements INodeType {
    description: INodeTypeDescription;
    webhook: typeof sendAndWaitWebhook;
    methods: {
        loadOptions: {
            getSpaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
        credentialTest: {
            testGoogleTokenAuth(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=GoogleChat.node.d.ts.map
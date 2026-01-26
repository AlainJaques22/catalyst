import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { smtpConnectionTest } from './utils';
import { sendAndWaitWebhook } from '../../../utils/sendAndWait/utils';
export declare const versionDescription: INodeTypeDescription;
export declare class EmailSendV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        credentialTest: {
            smtpConnectionTest: typeof smtpConnectionTest;
        };
    };
    webhook: typeof sendAndWaitWebhook;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=EmailSendV2.node.d.ts.map
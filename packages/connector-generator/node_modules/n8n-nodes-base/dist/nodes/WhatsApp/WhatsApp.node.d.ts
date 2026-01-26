import type { IExecuteFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { sendAndWaitWebhook } from '../../utils/sendAndWait/utils';
export declare class WhatsApp implements INodeType {
    description: INodeTypeDescription;
    webhook: typeof sendAndWaitWebhook;
    customOperations: {
        message: {
            sendAndWait(this: IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
        };
    };
}
//# sourceMappingURL=WhatsApp.node.d.ts.map
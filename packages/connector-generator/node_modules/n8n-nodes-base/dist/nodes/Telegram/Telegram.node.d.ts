import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { sendAndWaitWebhook } from '../../utils/sendAndWait/utils';
export declare class Telegram implements INodeType {
    description: INodeTypeDescription;
    webhook: typeof sendAndWaitWebhook;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Telegram.node.d.ts.map
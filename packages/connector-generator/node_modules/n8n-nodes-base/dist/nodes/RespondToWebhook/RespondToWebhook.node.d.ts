import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class RespondToWebhook implements INodeType {
    description: INodeTypeDescription;
    onMessage(context: IExecuteFunctions, _data: INodeExecutionData): Promise<INodeExecutionData[][]>;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=RespondToWebhook.node.d.ts.map
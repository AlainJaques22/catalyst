import { Node, type IExecuteFunctions, type INodeExecutionData, type INodeTypeDescription } from 'n8n-workflow';
export declare const apiUrl = "https://api.peekalink.io";
export declare class Peekalink extends Node {
    description: INodeTypeDescription;
    execute(context: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Peekalink.node.d.ts.map
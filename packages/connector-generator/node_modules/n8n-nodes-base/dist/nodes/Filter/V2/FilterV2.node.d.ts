import { type IExecuteFunctions, type INodeExecutionData, type INodeType, type INodeTypeBaseDescription, type INodeTypeDescription } from 'n8n-workflow';
export declare class FilterV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=FilterV2.node.d.ts.map
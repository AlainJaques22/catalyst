import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
export declare class IfV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=IfV1.node.d.ts.map
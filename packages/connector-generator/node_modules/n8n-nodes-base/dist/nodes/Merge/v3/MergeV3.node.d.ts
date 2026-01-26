import type { IExecuteFunctions, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { loadOptions } from './methods';
export declare class MergeV3 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: typeof loadOptions;
    };
    execute(this: IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
}
//# sourceMappingURL=MergeV3.node.d.ts.map
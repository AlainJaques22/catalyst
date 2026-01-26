import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { loadOptions } from './methods';
export declare class Simulate implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: typeof loadOptions;
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Simulate.node.d.ts.map
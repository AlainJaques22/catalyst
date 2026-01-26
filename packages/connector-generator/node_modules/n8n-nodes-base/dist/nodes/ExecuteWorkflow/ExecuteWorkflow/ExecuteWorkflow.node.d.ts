import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { localResourceMapping } from './methods';
export declare class ExecuteWorkflow implements INodeType {
    description: INodeTypeDescription;
    methods: {
        localResourceMapping: typeof localResourceMapping;
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=ExecuteWorkflow.node.d.ts.map
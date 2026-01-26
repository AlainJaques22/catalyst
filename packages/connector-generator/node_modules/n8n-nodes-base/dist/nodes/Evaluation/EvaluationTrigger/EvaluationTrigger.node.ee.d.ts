import type { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData, NodeExecutionWithMetadata } from 'n8n-workflow';
import { listSearch, loadOptions, credentialTest } from '../methods';
export declare const DEFAULT_STARTING_ROW = 2;
export declare class EvaluationTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: typeof loadOptions;
        listSearch: typeof listSearch;
        credentialTest: typeof credentialTest;
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    customOperations: {
        dataset: {
            getRows(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null>;
        };
    };
}
//# sourceMappingURL=EvaluationTrigger.node.ee.d.ts.map
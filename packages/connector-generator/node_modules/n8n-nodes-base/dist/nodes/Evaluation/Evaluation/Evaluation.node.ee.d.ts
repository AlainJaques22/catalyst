import type { IExecuteFunctions, INodeType, INodeTypeDescription, INodeExecutionData } from 'n8n-workflow';
import { listSearch, loadOptions, credentialTest } from '../methods';
export declare class Evaluation implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: typeof loadOptions;
        listSearch: typeof listSearch;
        credentialTest: typeof credentialTest;
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Evaluation.node.ee.d.ts.map
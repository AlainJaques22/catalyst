import type { IExecuteFunctions, INodeType, INodeTypeDescription, INodeTypeBaseDescription } from 'n8n-workflow';
import { loadOptions, listSearch } from './methods';
export declare class SplunkV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: typeof loadOptions;
        listSearch: typeof listSearch;
    };
    execute(this: IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
}
//# sourceMappingURL=SplunkV2.node.d.ts.map
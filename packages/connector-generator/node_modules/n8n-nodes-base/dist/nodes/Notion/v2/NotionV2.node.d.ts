import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { loadOptions } from './methods';
import { listSearch } from '../shared/methods';
export declare class NotionV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        listSearch: typeof listSearch;
        loadOptions: typeof loadOptions;
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=NotionV2.node.d.ts.map
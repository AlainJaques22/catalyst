import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { listSearch } from './methods';
export declare class AzureCosmosDb implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: typeof listSearch;
    };
}
//# sourceMappingURL=AzureCosmosDb.node.d.ts.map
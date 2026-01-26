import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { listSearch } from '../shared/methods';
export declare class NotionV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        listSearch: typeof listSearch;
        loadOptions: {
            getDatabaseProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getFilterProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getBlockTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getPropertySelectValues(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getDatabaseIdFromPage(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getDatabaseOptionsFromPage(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTimezones(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=NotionV1.node.d.ts.map
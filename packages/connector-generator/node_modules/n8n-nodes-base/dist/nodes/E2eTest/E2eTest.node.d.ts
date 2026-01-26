import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeListSearchResult, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type ResourceMapperFields } from 'n8n-workflow';
export declare class E2eTest implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
        listSearch: {
            optionsSearch(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
        };
        resourceMapping: {
            getMappingColumns(this: ILoadOptionsFunctions): Promise<ResourceMapperFields>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=E2eTest.node.d.ts.map
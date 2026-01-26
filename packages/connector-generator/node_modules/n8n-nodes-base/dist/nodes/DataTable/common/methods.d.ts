import { type ILoadOptionsFunctions, type INodeListSearchResult, type INodePropertyOptions, type ResourceMapperFields } from 'n8n-workflow';
export declare function tableSearch(this: ILoadOptionsFunctions, filterString?: string, prevPaginationToken?: string): Promise<INodeListSearchResult>;
export declare function getDataTableColumns(this: ILoadOptionsFunctions): Promise<(INodePropertyOptions & {
    type: string;
})[]>;
export declare function getConditionsForColumn(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function getDataTables(this: ILoadOptionsFunctions): Promise<ResourceMapperFields>;
//# sourceMappingURL=methods.d.ts.map
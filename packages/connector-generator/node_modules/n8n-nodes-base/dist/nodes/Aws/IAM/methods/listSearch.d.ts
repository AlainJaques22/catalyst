import type { IExecuteSingleFunctions, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
export declare function searchUsers(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function searchGroups(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function searchGroupsForUser(this: ILoadOptionsFunctions | IExecuteSingleFunctions, filter?: string): Promise<INodeListSearchResult>;
//# sourceMappingURL=listSearch.d.ts.map
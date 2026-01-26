import type { IExecuteSingleFunctions, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
export declare function searchGroups(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function searchGroupsForUser(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
export declare function searchUsers(this: IExecuteSingleFunctions | ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function searchUserPools(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
//# sourceMappingURL=listSearch.d.ts.map
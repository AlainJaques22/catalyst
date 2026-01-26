import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
export declare function getUsers(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function getRepositories(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function getWorkflows(this: ILoadOptionsFunctions, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function getRefs(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
//# sourceMappingURL=SearchFunctions.d.ts.map
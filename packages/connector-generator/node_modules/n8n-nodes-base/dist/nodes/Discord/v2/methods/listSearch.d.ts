import { type ILoadOptionsFunctions, type INodeListSearchResult } from 'n8n-workflow';
export declare function guildSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult>;
export declare function channelSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult>;
export declare function textChannelSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult>;
export declare function categorySearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult>;
export declare function userSearch(this: ILoadOptionsFunctions, _filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
//# sourceMappingURL=listSearch.d.ts.map
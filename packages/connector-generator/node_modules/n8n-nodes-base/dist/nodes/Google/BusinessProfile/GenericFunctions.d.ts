import { type DeclarativeRestApiSettings, type IDataObject, type IExecutePaginationFunctions, type IExecuteSingleFunctions, type IHttpRequestMethods, type IHttpRequestOptions, type ILoadOptionsFunctions, type IN8nHttpFullResponse, type INodeExecutionData, type INodeListSearchResult, type IPollFunctions } from 'n8n-workflow';
export declare function handleDatesPresend(this: IExecuteSingleFunctions, opts: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function addUpdateMaskPresend(this: IExecuteSingleFunctions, opts: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function handlePagination(this: IExecutePaginationFunctions, resultOptions: DeclarativeRestApiSettings.ResultOptions): Promise<INodeExecutionData[]>;
export declare function handleErrorsDeletePost(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function handleErrorsGetPost(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function handleErrorsUpdatePost(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function handleErrorsDeleteReply(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function handleErrorsGetReview(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function handleErrorsReplyToReview(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function googleApiRequest(this: ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, url?: string): Promise<IDataObject>;
export declare function searchAccounts(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function searchLocations(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function searchReviews(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function searchPosts(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IDataObject, IExecuteFunctions, IExecuteSingleFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeExecutionData, IN8nHttpFullResponse, INodePropertyOptions, INodeListSearchResult } from 'n8n-workflow';
export declare function microsoftApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, headers?: IDataObject, url?: string): Promise<any>;
export declare function microsoftApiPaginateRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, headers?: IDataObject, url?: string, itemIndex?: number): Promise<IDataObject[]>;
export declare function handleErrorPostReceive(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function getGroupProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function getUserProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function getGroups(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
export declare function getUsers(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
//# sourceMappingURL=GenericFunctions.d.ts.map
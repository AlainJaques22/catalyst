import type { IHttpRequestOptions, IDataObject, IExecuteSingleFunctions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
export declare function encodeBodyAsFormUrlEncoded(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function findUsersForGroup(this: IExecuteSingleFunctions, groupName: string): Promise<IDataObject[]>;
export declare function simplifyGetGroupsResponse(this: IExecuteSingleFunctions, _: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function simplifyGetAllGroupsResponse(this: IExecuteSingleFunctions, items: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function simplifyGetAllUsersResponse(this: IExecuteSingleFunctions, _items: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function deleteGroupMembers(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function validatePath(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function validateUserPath(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function validateName(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function validatePermissionsBoundary(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function preprocessTags(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function removeUserFromGroups(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
//# sourceMappingURL=utils.d.ts.map
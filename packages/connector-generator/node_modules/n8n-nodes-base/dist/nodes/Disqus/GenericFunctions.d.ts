import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function disqusApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, qs?: IDataObject, uri?: string, body?: IDataObject, option?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
export declare function disqusApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, qs?: IDataObject, uri?: string, body?: IDataObject, option?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
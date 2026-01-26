import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to HackerNews
 *
 */
export declare function hackerNewsApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject): Promise<any>;
/**
 * Make an API request to HackerNews
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function hackerNewsApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
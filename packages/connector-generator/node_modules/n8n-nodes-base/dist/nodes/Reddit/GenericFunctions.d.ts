import type { IExecuteFunctions, IHookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an authenticated or unauthenticated API request to Reddit.
 */
export declare function redditApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject): Promise<any>;
/**
 * Make an unauthenticated API request to Reddit and return all results.
 */
export declare function redditApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject): Promise<any>;
/**
 * Handles a large Reddit listing by returning all items or up to a limit.
 */
export declare function handleListing(this: IExecuteFunctions, i: number, endpoint: string, qs?: IDataObject, requestMethod?: 'GET' | 'POST'): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an authenticated API request to Bubble.
 */
export declare function bubbleApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, qs: IDataObject): Promise<any>;
/**
 * Make an authenticated API request to Bubble and return all results.
 */
export declare function bubbleApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, qs: IDataObject): Promise<IDataObject[]>;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
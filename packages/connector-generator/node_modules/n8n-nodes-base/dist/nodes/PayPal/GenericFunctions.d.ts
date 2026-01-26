import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function payPalApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, endpoint: string, method: IHttpRequestMethods, body?: any, query?: IDataObject, uri?: string): Promise<any>;
/**
 * Make an API request to paginated paypal endpoint
 * and return all results
 */
export declare function payPalApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, endpoint: string, method: IHttpRequestMethods, body?: any, query?: IDataObject, uri?: string): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
export declare function upperFist(s: string): string;
//# sourceMappingURL=GenericFunctions.d.ts.map
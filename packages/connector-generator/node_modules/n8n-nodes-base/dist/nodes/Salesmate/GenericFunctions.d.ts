import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function salesmateApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, _option?: IDataObject): Promise<any>;
export declare function salesmateApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
/**
 * Converts data from the Salesmate format into a simple object
 *
 */
export declare function simplifySalesmateData(data: IDataObject[]): IDataObject;
//# sourceMappingURL=GenericFunctions.d.ts.map
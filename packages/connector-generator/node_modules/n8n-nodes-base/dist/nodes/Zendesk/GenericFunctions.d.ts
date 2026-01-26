import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function zendeskApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
export declare function zendeskApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
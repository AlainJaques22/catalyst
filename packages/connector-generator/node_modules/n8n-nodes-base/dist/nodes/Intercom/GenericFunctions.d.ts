import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function intercomApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, endpoint: string, method: IHttpRequestMethods, body?: any, query?: IDataObject, uri?: string): Promise<any>;
/**
 * Make an API request to paginated intercom endpoint
 * and return all results
 */
export declare function intercomApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, propertyName: string, endpoint: string, method: IHttpRequestMethods, body?: any, query?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
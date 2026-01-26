import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
/**
 * Make an API request to Trello
 *
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject): Promise<any>;
export declare function apiRequestAllItems(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
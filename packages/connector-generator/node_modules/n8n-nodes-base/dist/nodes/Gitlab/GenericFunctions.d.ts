import type { IExecuteFunctions, IHookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Gitlab
 *
 */
export declare function gitlabApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject, option?: IDataObject): Promise<any>;
export declare function gitlabApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
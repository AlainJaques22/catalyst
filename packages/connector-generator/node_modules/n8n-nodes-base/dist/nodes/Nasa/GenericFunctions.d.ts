import type { IExecuteFunctions, IHookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function nasaApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject, option?: IDataObject, uri?: string): Promise<any>;
export declare function nasaApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
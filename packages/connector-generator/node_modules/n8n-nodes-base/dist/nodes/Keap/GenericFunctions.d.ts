import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
export declare function keapApiRequest(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject, option?: IDataObject): Promise<any>;
export declare function keapApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function keysToSnakeCase(elements: IDataObject[] | IDataObject): IDataObject[];
//# sourceMappingURL=GenericFunctions.d.ts.map
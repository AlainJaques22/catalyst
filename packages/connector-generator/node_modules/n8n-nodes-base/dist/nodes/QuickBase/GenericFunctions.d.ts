import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
export declare function quickbaseApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, option?: IDataObject): Promise<any>;
export declare function getFieldsObject(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, tableId: string): Promise<any>;
export declare function quickbaseApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
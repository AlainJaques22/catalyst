import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, IHookFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function pagerDutyApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function pagerDutyApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function keysToSnakeCase(elements: IDataObject[] | IDataObject): IDataObject[];
//# sourceMappingURL=GenericFunctions.d.ts.map
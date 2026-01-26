import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function paddleApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, endpoint: string, method: IHttpRequestMethods, body?: any, _query?: IDataObject, _uri?: string): Promise<any>;
export declare function paddleApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, propertyName: string, endpoint: string, method: IHttpRequestMethods, body?: any, query?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
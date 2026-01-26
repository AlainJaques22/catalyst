import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHookFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function bannerbearApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function keysToSnakeCase(elements: IDataObject[] | IDataObject): IDataObject[];
//# sourceMappingURL=GenericFunctions.d.ts.map
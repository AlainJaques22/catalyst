import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function shopifyApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function shopifyApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject): Promise<any>;
export declare function keysToSnakeCase(elements: IDataObject[] | IDataObject): IDataObject[];
//# sourceMappingURL=GenericFunctions.d.ts.map
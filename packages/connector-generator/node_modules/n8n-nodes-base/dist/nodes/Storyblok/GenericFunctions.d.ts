import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function storyblokApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, option?: IDataObject): Promise<any>;
export declare function storyblokApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
export declare function mailerliteApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, method: IHttpRequestMethods, path: string, body?: any, qs?: IDataObject, _option?: {}): Promise<any>;
export declare function mailerliteApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function getCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function gotifyApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, path: string, body?: any, qs?: IDataObject, uri?: string, _option?: {}): Promise<any>;
export declare function gotifyApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
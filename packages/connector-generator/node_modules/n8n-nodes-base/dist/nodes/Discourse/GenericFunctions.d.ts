import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function discourseApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, path: string, body?: any, qs?: IDataObject, _option?: {}): Promise<any>;
export declare function discourseApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
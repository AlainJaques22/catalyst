import type { IExecuteFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function splunkApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function splunkApiJsonRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
//# sourceMappingURL=index.d.ts.map
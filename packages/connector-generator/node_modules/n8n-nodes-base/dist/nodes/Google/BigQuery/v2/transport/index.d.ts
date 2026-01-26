import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function googleBigQueryApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function googleBigQueryApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<any>;
//# sourceMappingURL=index.d.ts.map
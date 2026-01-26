import type { IExecuteFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function elasticsearchBulkApiRequest(this: IExecuteFunctions, body: IDataObject): Promise<any>;
export declare function elasticsearchApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function elasticsearchApiRequestAllItems(this: IExecuteFunctions, indexId: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
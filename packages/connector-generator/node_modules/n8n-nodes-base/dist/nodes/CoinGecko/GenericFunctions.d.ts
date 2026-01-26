import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function coinGeckoApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function coinGeckoRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
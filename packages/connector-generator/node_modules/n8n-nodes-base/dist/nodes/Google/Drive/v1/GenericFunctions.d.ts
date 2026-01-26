import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IPollFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function extractId(url: string): string;
//# sourceMappingURL=GenericFunctions.d.ts.map
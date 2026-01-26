import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function simplify(rows: IDataObject[], fields: string[]): IDataObject[];
//# sourceMappingURL=GenericFunctions.d.ts.map
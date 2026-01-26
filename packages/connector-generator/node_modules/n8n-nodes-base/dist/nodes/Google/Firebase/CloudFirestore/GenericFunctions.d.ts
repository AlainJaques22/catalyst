import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string | null): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject, uri?: string | null): Promise<any>;
export declare function jsonToDocument(value: string | number | IDataObject | IDataObject[]): IDataObject;
export declare function documentToJson(fields: IDataObject): IDataObject;
export declare function fullDocumentToJson(data: IDataObject): IDataObject;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function mindeeApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, path: string, body?: any, qs?: IDataObject, option?: {}): Promise<any>;
export declare function cleanDataPreviousApiVersions(predictions: IDataObject[]): IDataObject;
export declare function cleanData(document: IDataObject): IDataObject;
//# sourceMappingURL=GenericFunctions.d.ts.map
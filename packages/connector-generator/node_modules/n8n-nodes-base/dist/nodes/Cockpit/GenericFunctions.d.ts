import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function cockpitApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, uri?: string, option?: IDataObject): Promise<any>;
export declare function createDataFromParameters(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): IDataObject;
//# sourceMappingURL=GenericFunctions.d.ts.map
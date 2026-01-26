import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function philipsHueApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function getUser(this: IExecuteFunctions | ILoadOptionsFunctions): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
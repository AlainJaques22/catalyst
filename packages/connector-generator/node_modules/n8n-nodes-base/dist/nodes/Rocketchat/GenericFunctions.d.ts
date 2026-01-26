import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function rocketchatApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, resource: string, method: IHttpRequestMethods, operation: string, body?: any, headers?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function matrixApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: string | object, query?: IDataObject, headers?: IDataObject | undefined, option?: IDataObject): Promise<any>;
export declare function handleMatrixCall(this: IExecuteFunctions, index: number, resource: string, operation: string): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function phantombusterApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, path: string, body?: any, qs?: IDataObject, _option?: {}): Promise<any>;
export declare function validateJSON(self: IExecuteFunctions, json: string | undefined, name: string): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
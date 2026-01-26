import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function mailchimpApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, endpoint: string, method: IHttpRequestMethods, body?: any, qs?: IDataObject, _headers?: object): Promise<any>;
export declare function mailchimpApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, endpoint: string, method: IHttpRequestMethods, propertyName: string, body?: any, query?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
export declare const campaignFieldsMetadata: string[];
//# sourceMappingURL=GenericFunctions.d.ts.map
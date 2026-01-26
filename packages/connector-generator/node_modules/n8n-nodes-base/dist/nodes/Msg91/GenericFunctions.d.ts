import type { IExecuteFunctions, IHookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to MSG91
 *
 */
export declare function msg91ApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
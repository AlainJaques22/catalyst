import type { IExecuteFunctions, IHookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Plivo.
 *
 */
export declare function plivoApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
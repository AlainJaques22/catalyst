import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to seven
 *
 * @param {IHookFunctions | IExecuteFunctions} this
 * @param {object | undefined} data
 */
export declare function sms77ApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, qs?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
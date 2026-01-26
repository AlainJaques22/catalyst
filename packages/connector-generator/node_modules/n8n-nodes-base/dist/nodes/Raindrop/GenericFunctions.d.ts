import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an authenticated API request to Raindrop.
 */
export declare function raindropApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject, body: IDataObject, option?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
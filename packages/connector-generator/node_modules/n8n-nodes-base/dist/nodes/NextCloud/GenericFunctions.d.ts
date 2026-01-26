import { type IExecuteFunctions, type IHookFunctions, type IHttpRequestMethods, type IDataObject } from 'n8n-workflow';
/**
 * Make an API request to NextCloud
 *
 */
export declare function nextCloudApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: object | string | Buffer, headers?: IDataObject, encoding?: null, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
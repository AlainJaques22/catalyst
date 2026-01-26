import type { IExecuteFunctions, IHookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Message Bird
 *
 */
export declare function messageBirdApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, resource: string, body: IDataObject, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
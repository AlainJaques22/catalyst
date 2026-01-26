import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
/**
 * Make an API request to Twake
 *
 */
export declare function twakeApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body: object, query?: IDataObject, uri?: string): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IExecuteFunctions, IHookFunctions, IDataObject, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
/**
 * Make an API request to Twilio
 *
 */
export declare function twilioApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any>;
export declare function twilioTriggerApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: FormData | IDataObject): Promise<any>;
export declare function escapeXml(str: string): string;
//# sourceMappingURL=GenericFunctions.d.ts.map
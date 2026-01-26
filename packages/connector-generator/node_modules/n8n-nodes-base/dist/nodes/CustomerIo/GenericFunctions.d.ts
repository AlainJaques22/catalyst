import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function customerIoApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: object, baseApi?: string, _query?: IDataObject): Promise<any>;
export declare function eventExists(currentEvents: string[], webhookEvents: IDataObject): boolean;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
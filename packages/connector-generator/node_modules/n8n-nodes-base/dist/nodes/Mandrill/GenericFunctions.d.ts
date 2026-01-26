import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function mandrillApiRequest(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, resource: string, method: IHttpRequestMethods, action: string, body?: any, headers?: IDataObject): Promise<any>;
export declare function getToEmailArray(toEmail: string): any;
export declare function getGoogleAnalyticsDomainsArray(s: string): string[];
export declare function getTags(s: string): any[];
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHookFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function postmarkApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, option?: IDataObject): Promise<any>;
export declare function convertTriggerObjectToStringArray(webhookObject: any): string[];
export declare function eventExists(currentEvents: string[], webhookEvents: string[]): boolean;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
/**
 * Method will call register or list webhooks based on the passed method in the parameter
 */
export declare function formIoApiRequest(this: IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, endpoint: string, body?: {}, qs?: {}): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
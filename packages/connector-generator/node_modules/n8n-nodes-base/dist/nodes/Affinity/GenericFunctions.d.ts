import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, IHookFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function affinityApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function affinityApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject): Promise<any>;
export declare function eventsExist(subscriptions: string[], currentSubsriptions: string[]): boolean;
export declare function mapResource(key: string): string | undefined;
//# sourceMappingURL=GenericFunctions.d.ts.map
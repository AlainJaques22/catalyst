import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods, IWebhookFunctions } from 'n8n-workflow';
import type { SendAndWaitMessageBody } from './MessageInterface';
export declare function slackApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: object, query?: IDataObject, headers?: {} | undefined, option?: {}): Promise<any>;
export declare function slackApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function getMessageContent(this: IExecuteFunctions | ILoadOptionsFunctions, i: number, nodeVersion: number, instanceId?: string): IDataObject;
export declare function validateJSON(json: string | undefined): any;
export declare function getTarget(context: IExecuteFunctions, itemIndex: number, idType: 'user' | 'channel'): string;
export declare function processThreadOptions(threadOptions: IDataObject | undefined): IDataObject;
export declare function createSendAndWaitMessageBody(context: IExecuteFunctions): SendAndWaitMessageBody;
//# sourceMappingURL=GenericFunctions.d.ts.map
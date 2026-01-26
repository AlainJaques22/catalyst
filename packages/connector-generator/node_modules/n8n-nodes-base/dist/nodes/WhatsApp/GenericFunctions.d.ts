import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestOptions, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
import type { WhatsAppAppWebhookSubscription } from './types';
import type { SendAndWaitConfig } from '../../utils/sendAndWait/utils';
export declare const WHATSAPP_BASE_URL = "https://graph.facebook.com/v13.0/";
export declare function appWebhookSubscriptionList(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, appId: string): Promise<WhatsAppAppWebhookSubscription[]>;
export declare function appWebhookSubscriptionCreate(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, appId: string, subscription: IDataObject): Promise<any>;
export declare function appWebhookSubscriptionDelete(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, appId: string, object: string): Promise<any>;
export declare const createMessage: (sendAndWaitConfig: SendAndWaitConfig, phoneNumberId: string, recipientPhoneNumber: string, instanceId: string) => IHttpRequestOptions;
//# sourceMappingURL=GenericFunctions.d.ts.map
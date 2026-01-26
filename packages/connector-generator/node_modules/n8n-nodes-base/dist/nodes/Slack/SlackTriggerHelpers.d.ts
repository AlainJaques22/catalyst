import type { IWebhookFunctions } from 'n8n-workflow';
export declare function getUserInfo(this: IWebhookFunctions, userId: string): Promise<any>;
export declare function getChannelInfo(this: IWebhookFunctions, channelId: string): Promise<any>;
export declare function downloadFile(this: IWebhookFunctions, url: string): Promise<any>;
export declare function verifySignature(this: IWebhookFunctions): Promise<boolean>;
//# sourceMappingURL=SlackTriggerHelpers.d.ts.map
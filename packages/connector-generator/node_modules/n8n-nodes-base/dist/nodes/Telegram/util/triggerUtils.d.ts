import { type ICredentialDataDecryptedObject, type IDataObject, type IWebhookFunctions, type IWebhookResponseData } from 'n8n-workflow';
import { type IEvent } from '../IEvent';
export declare const downloadFile: (webhookFunctions: IWebhookFunctions, credentials: ICredentialDataDecryptedObject, bodyData: IEvent, additionalFields: IDataObject) => Promise<IWebhookResponseData>;
//# sourceMappingURL=triggerUtils.d.ts.map
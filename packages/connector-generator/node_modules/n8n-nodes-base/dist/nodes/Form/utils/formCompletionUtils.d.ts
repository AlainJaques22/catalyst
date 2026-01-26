import { type Response } from 'express';
import { type NodeTypeAndVersion, type IWebhookFunctions, type IWebhookResponseData } from 'n8n-workflow';
export declare const binaryResponse: (context: IWebhookFunctions) => Promise<{
    data: string | Buffer;
    fileName: string;
    type: string;
}>;
export declare const renderFormCompletion: (context: IWebhookFunctions, res: Response, trigger: NodeTypeAndVersion) => Promise<IWebhookResponseData>;
//# sourceMappingURL=formCompletionUtils.d.ts.map
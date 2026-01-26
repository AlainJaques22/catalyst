import type { IExecuteFunctions } from 'n8n-workflow';
import type { IEmail } from '../../../../../utils/sendAndWait/interfaces';
/**
 * Adds inReplyTo and reference headers to the email if threadId is provided.
 */
export declare function addThreadHeadersToEmail(this: IExecuteFunctions, email: IEmail, threadId: string): Promise<void>;
//# sourceMappingURL=draft.d.ts.map
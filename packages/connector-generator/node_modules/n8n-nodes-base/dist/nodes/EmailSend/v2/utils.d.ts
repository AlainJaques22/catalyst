import type { IDataObject, ICredentialsDecrypted, ICredentialTestFunctions, INodeCredentialTestResult } from 'n8n-workflow';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
export type EmailSendOptions = {
    appendAttribution?: boolean;
    allowUnauthorizedCerts?: boolean;
    attachments?: string;
    ccEmail?: string;
    bccEmail?: string;
    replyTo?: string;
};
export declare function configureTransport(credentials: IDataObject, options: EmailSendOptions): import("nodemailer").Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
export declare function smtpConnectionTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
//# sourceMappingURL=utils.d.ts.map
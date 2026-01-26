import { type ImapSimple, type Message, type MessagePart, type SearchCriteria } from '@n8n/imap';
import { type IBinaryData, type INodeExecutionData, type ITriggerFunctions } from 'n8n-workflow';
export declare function getNewEmails(this: ITriggerFunctions, { getAttachment, getText, onEmailBatch, imapConnection, postProcessAction, searchCriteria, }: {
    imapConnection: ImapSimple;
    searchCriteria: SearchCriteria[];
    postProcessAction: string;
    getText: (parts: MessagePart[], message: Message, subtype: string) => Promise<string>;
    getAttachment: (imapConnection: ImapSimple, parts: MessagePart[], message: Message) => Promise<IBinaryData[]>;
    onEmailBatch: (data: INodeExecutionData[]) => Promise<void>;
}): Promise<void>;
//# sourceMappingURL=utils.d.ts.map
import type { Config, ImapMessageBodyInfo, ImapMessageAttributes } from 'imap';
export interface ImapSimpleOptions {
    imap: Config;
    onMail?: ((numNewMail: number) => void) | undefined;
    onExpunge?: ((seqNo: number) => void) | undefined;
    onUpdate?: ((seqNo: number, info: {
        num: number | undefined;
        text: unknown;
    }) => void) | undefined;
}
export interface MessagePart {
    partID: string;
    encoding: 'BASE64' | 'QUOTED-PRINTABLE' | '7BIT' | '8BIT' | 'BINARY' | 'UUENCODE';
    type: 'TEXT';
    subtype: string;
    params?: {
        charset?: string;
    };
    disposition?: {
        type: string;
    };
}
export interface MessageBodyPart extends ImapMessageBodyInfo {
    body: string | object;
}
export interface Message {
    attributes: ImapMessageAttributes;
    parts: MessageBodyPart[];
    seqNo?: number;
}
export type SearchCriteria = string | [string, string];

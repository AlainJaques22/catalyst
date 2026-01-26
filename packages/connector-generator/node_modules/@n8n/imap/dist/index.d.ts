import { ImapSimple } from './imap-simple';
import type { ImapSimpleOptions, MessagePart } from './types';
export declare function connect(options: ImapSimpleOptions): Promise<ImapSimple>;
export declare function getParts(struct: any, parts?: MessagePart[]): MessagePart[];
export * from './imap-simple';
export * from './errors';
export type * from './types';

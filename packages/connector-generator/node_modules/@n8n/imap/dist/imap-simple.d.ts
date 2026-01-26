import { EventEmitter } from 'events';
import type Imap from 'imap';
import { PartData } from './part-data';
import type { Message, MessagePart, SearchCriteria } from './types';
export declare class ImapSimple extends EventEmitter {
    private readonly imap;
    private ending;
    constructor(imap: Imap);
    end(): void;
    search(searchCriteria: SearchCriteria[], fetchOptions: Imap.FetchOptions, limit?: number): Promise<Message[]>;
    getPartData(message: Message, part: MessagePart): Promise<PartData>;
    addFlags(uid: number[], flags: string | string[]): Promise<void>;
    getBoxes(): Promise<Imap.MailBoxes>;
    openBox(boxName: string): Promise<Imap.Box>;
    closeBox(autoExpunge?: boolean): Promise<void>;
}

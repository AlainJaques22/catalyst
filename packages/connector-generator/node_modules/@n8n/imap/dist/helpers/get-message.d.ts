import { type ImapMessage } from 'imap';
import type { Message } from '../types';
export declare function getMessage(message: ImapMessage): Promise<Message>;

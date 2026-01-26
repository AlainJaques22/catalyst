import { Client } from 'ldapts';
import type { Entry } from 'ldapts';
import type { ICredentialDataDecryptedObject, Logger } from 'n8n-workflow';
export declare const BINARY_AD_ATTRIBUTES: string[];
export declare const resolveBinaryAttributes: (entries: Entry[]) => void;
export declare function createLdapClient(context: {
    logger: Logger;
}, credentials: ICredentialDataDecryptedObject, nodeDebug?: boolean, nodeType?: string, nodeName?: string): Promise<Client>;
//# sourceMappingURL=Helpers.d.ts.map
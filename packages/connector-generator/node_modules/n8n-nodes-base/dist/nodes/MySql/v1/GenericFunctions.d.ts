import mysql2 from 'mysql2/promise';
import type { ICredentialDataDecryptedObject, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
export declare function createConnection(credentials: ICredentialDataDecryptedObject): Promise<mysql2.Connection>;
export declare function searchTables(this: ILoadOptionsFunctions, tableName?: string): Promise<INodeListSearchResult>;
//# sourceMappingURL=GenericFunctions.d.ts.map
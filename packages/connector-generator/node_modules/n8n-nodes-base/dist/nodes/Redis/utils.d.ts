import type { ICredentialTestFunctions, ICredentialsDecrypted, IDataObject, IExecuteFunctions, INodeCredentialTestResult } from 'n8n-workflow';
import type { RedisCredential, RedisClient } from './types';
export declare function setupRedisClient(credentials: RedisCredential, isTest?: boolean): RedisClient;
export declare function redisConnectionTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
/** Converts the Redis Info String into an object */
export declare function convertInfoToObject(stringData: string): IDataObject;
export declare function getValue(client: RedisClient, keyName: string, type?: string): Promise<string | {
    [x: string]: string;
} | string[] | null | undefined>;
export declare function setValue(this: IExecuteFunctions, client: RedisClient, keyName: string, value: string | number | object | string[] | number[], expire: boolean, ttl: number, type?: string, valueIsJSON?: boolean): Promise<void>;
//# sourceMappingURL=utils.d.ts.map
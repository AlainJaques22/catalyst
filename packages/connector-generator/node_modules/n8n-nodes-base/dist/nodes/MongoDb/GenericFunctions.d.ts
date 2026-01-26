import { MongoClient } from 'mongodb';
import type { ICredentialDataDecryptedObject, IDataObject, INode, INodeExecutionData } from 'n8n-workflow';
import type { IMongoCredentials, IMongoCredentialsType, IMongoParametricCredentials } from './mongoDb.types';
/**
 * Standard way of building the MongoDB connection string, unless overridden with a provided string
 *
 * @param {ICredentialDataDecryptedObject} credentials MongoDB credentials to use, unless conn string is overridden
 */
export declare function buildParameterizedConnString(credentials: IMongoParametricCredentials): string;
/**
 * Build mongoDb connection string and resolve database name.
 * If a connection string override value is provided, that will be used in place of individual args
 *
 * @param {ICredentialDataDecryptedObject} credentials raw/input MongoDB credentials to use
 */
export declare function buildMongoConnectionParams(node: INode, credentials: IMongoCredentialsType): IMongoCredentials;
/**
 * Verify credentials. If ok, build mongoDb connection string and resolve database name.
 *
 * @param {ICredentialDataDecryptedObject} credentials raw/input MongoDB credentials to use
 */
export declare function validateAndResolveMongoCredentials(node: INode, credentials?: ICredentialDataDecryptedObject): IMongoCredentials;
export declare function prepareItems({ items, fields, updateKey, useDotNotation, dateFields, isUpdate, }: {
    items: INodeExecutionData[];
    fields: string[];
    updateKey?: string;
    useDotNotation?: boolean;
    dateFields?: string[];
    isUpdate?: boolean;
}): IDataObject[];
export declare function prepareFields(fields: string): string[];
export declare function stringifyObjectIDs(items: INodeExecutionData[]): INodeExecutionData[];
export declare function connectMongoClient(connectionString: string, nodeVersion: number, credentials?: IDataObject): Promise<MongoClient>;
//# sourceMappingURL=GenericFunctions.d.ts.map
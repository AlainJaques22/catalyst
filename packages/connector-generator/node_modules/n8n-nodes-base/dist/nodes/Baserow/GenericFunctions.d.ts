import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
import type { BaserowCredentials, LoadedResource } from './types';
/**
 * Make a request to Baserow API.
 */
export declare function baserowApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, jwtToken: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
/**
 * Get all results from a paginated query to Baserow API.
 */
export declare function baserowApiRequestAllItems(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, jwtToken: string, body: IDataObject, qs?: IDataObject): Promise<IDataObject[]>;
/**
 * Get a JWT token based on Baserow account username and password.
 */
export declare function getJwtToken(this: IExecuteFunctions | ILoadOptionsFunctions, { username, password, host }: BaserowCredentials): Promise<string>;
export declare function getFieldNamesAndIds(this: IExecuteFunctions, tableId: string, jwtToken: string): Promise<{
    names: string[];
    ids: string[];
}>;
export declare const toOptions: (items: LoadedResource[]) => {
    name: string;
    value: number;
}[];
/**
 * Responsible for mapping field IDs `field_n` to names and vice versa.
 */
export declare class TableFieldMapper {
    nameToIdMapping: Record<string, string>;
    idToNameMapping: Record<string, string>;
    mapIds: boolean;
    getTableFields(this: IExecuteFunctions, table: string, jwtToken: string): Promise<LoadedResource[]>;
    createMappings(tableFields: LoadedResource[]): void;
    private createIdToNameMapping;
    private createNameToIdMapping;
    setField(field: string): string;
    idsToNames(obj: Record<string, unknown>): void;
    namesToIds(obj: Record<string, unknown>): void;
}
//# sourceMappingURL=GenericFunctions.d.ts.map
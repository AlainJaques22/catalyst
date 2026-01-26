import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, GenericValue, ICredentialDataDecryptedObject, ICredentialTestFunctions, IDataObject } from 'n8n-workflow';
/**
 * Make an API request to Mattermost
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD', endpoint: string, body?: IDataObject | GenericValue | GenericValue[], query?: IDataObject): Promise<any>;
export declare function apiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD', endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
export declare function validateCredentials(this: ICredentialTestFunctions, decryptedCredentials: ICredentialDataDecryptedObject): Promise<any>;
//# sourceMappingURL=index.d.ts.map
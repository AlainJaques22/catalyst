import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Dropbox
 *
 */
export declare function dropboxApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject, headers?: IDataObject, option?: IDataObject): Promise<any>;
export declare function dropboxpiRequestAllItems(this: IExecuteFunctions | IHookFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject, headers?: IDataObject): Promise<any>;
export declare function getRootDirectory(this: IHookFunctions | IExecuteFunctions): Promise<any>;
export declare function simplify(data: IDataObject[]): IDataObject[];
export declare function getCredentials(this: IExecuteFunctions): Promise<import("n8n-workflow").ICredentialDataDecryptedObject>;
//# sourceMappingURL=GenericFunctions.d.ts.map
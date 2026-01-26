import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Make an authenticated API request to Bitwarden.
 */
export declare function bitwardenApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject, body: IDataObject, token: string): Promise<any>;
/**
 * Retrieve the access token needed for every API request to Bitwarden.
 */
export declare function getAccessToken(this: IExecuteFunctions | ILoadOptionsFunctions): Promise<any>;
/**
 * Supplement a `getAll` operation with `returnAll` and `limit` parameters.
 */
export declare function handleGetAll(this: IExecuteFunctions, i: number, method: IHttpRequestMethods, endpoint: string, qs: IDataObject, body: IDataObject, token: string): Promise<any>;
/**
 * Load a resource so that it can be selected by name from a dropdown.
 */
export declare function loadResource(this: ILoadOptionsFunctions, resource: string): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
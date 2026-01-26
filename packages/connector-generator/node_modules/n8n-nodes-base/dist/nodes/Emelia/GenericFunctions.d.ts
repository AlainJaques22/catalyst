import type { ICredentialsDecrypted, ICredentialTestFunctions, IExecuteFunctions, ILoadOptionsFunctions, IHookFunctions, INodeCredentialTestResult, INodePropertyOptions, IHttpRequestMethods, IDataObject } from 'n8n-workflow';
/**
 * Make an authenticated REST API request to Emelia, used for trigger node.
 */
export declare function emeliaApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, method: IHttpRequestMethods, endpoint: string, body?: object, qs?: IDataObject): Promise<any>;
/**
 * Make an authenticated GraphQL request to Emelia.
 */
export declare function emeliaGraphqlRequest(this: IExecuteFunctions | ILoadOptionsFunctions, body?: object): Promise<any>;
/**
 * Load resources so that the user can select them easily.
 */
export declare function loadResource(this: ILoadOptionsFunctions, resource: 'campaign' | 'contactList'): Promise<INodePropertyOptions[]>;
export declare function emeliaApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
//# sourceMappingURL=GenericFunctions.d.ts.map
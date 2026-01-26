import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Github
 *
 */
export declare function githubApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject, option?: IDataObject): Promise<any>;
/**
 * Returns the SHA of the given file
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function getFileSha(this: IHookFunctions | IExecuteFunctions, owner: string, repository: string, filePath: string, branch?: string): Promise<any>;
export declare function githubApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function isBase64(content: string): boolean;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
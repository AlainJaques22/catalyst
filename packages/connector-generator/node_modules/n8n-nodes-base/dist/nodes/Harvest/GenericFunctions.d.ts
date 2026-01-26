import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function harvestApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, qs: IDataObject, path: string, body?: IDataObject, option?: IDataObject, uri?: string): Promise<any>;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
export declare function harvestApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, qs: IDataObject, uri: string, resource: string, body?: IDataObject, option?: IDataObject): Promise<any>;
/**
 * fetch All resource using paginated calls
 */
export declare function getAllResource(this: IExecuteFunctions | ILoadOptionsFunctions, resource: string, i: number): Promise<IDataObject[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
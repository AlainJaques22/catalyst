import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function travisciApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject | string, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated TravisCI endpoint
 * and return all results
 */
export declare function travisciApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
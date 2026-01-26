import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, GenericValue, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Mattermost
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject | GenericValue | GenericValue[], query?: IDataObject): Promise<any>;
export declare function apiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD', endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
//# sourceMappingURL=index.d.ts.map
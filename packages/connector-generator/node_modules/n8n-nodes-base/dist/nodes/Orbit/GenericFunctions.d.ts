import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
import type { IRelation } from './Interfaces';
export declare function orbitApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function resolveIdentities(responseData: IRelation): void;
export declare function resolveMember(responseData: IRelation): void;
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
export declare function orbitApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
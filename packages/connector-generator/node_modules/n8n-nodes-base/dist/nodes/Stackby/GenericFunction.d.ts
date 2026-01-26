import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IPollFunctions } from 'n8n-workflow';
/**
 * Make an API request to Airtable
 *
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated Airtable endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function apiRequestAllItems(this: IHookFunctions | IExecuteFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
export interface IRecord {
    field: {
        [key: string]: string;
    };
}
//# sourceMappingURL=GenericFunction.d.ts.map
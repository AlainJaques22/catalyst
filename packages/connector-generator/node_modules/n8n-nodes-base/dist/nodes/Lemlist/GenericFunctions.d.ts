import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an authenticated API request to Lemlist.
 */
export declare function lemlistApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, option?: IDataObject): Promise<any>;
/**
 * Make an authenticated API request to Lemlist and return all results.
 */
export declare function lemlistApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, method: IHttpRequestMethods, endpoint: string, qs?: IDataObject): Promise<IDataObject[]>;
export declare function getEvents(): {
    name: string;
    value: string;
}[];
//# sourceMappingURL=GenericFunctions.d.ts.map
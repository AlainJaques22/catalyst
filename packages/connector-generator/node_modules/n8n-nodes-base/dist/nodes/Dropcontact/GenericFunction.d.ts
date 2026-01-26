import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IPairedItemData, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an authenticated API request to Bubble.
 */
export declare function dropcontactApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, qs: IDataObject): Promise<any>;
export declare function mapPairedItemsFrom<T>(iterable: Iterable<T> | ArrayLike<T>): IPairedItemData[];
//# sourceMappingURL=GenericFunction.d.ts.map
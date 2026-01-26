import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeExecutionData, IPairedItemData, IPollFunctions } from 'n8n-workflow';
/**
 * Make an API request to NocoDB
 *
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated NocoDB endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function apiRequestAllItems(this: IHookFunctions | IExecuteFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any>;
export declare function downloadRecordAttachments(this: IExecuteFunctions | IPollFunctions, records: IDataObject[], fieldNames: string[], pairedItem?: IPairedItemData[]): Promise<INodeExecutionData[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
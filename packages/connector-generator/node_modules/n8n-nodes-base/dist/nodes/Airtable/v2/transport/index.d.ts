import type { IDataObject, IExecuteFunctions, IPollFunctions, ILoadOptionsFunctions, INodeExecutionData, IPairedItemData, IHttpRequestMethods } from 'n8n-workflow';
import type { IRecord } from '../helpers/interfaces';
/**
 * Make an API request to Airtable
 *
 */
export declare function apiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated Airtable endpoint
 * and return all results
 *
 * @param {(IExecuteFunctions | IExecuteFunctions)} this
 */
export declare function apiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<{
    records: IDataObject[];
}>;
export declare function downloadRecordAttachments(this: IExecuteFunctions | IPollFunctions, records: IRecord[], fieldNames: string | string[], pairedItem?: IPairedItemData[]): Promise<INodeExecutionData[]>;
export declare function batchUpdate(this: IExecuteFunctions | IPollFunctions, endpoint: string, body: IDataObject, updateRecords: IDataObject[]): Promise<IDataObject>;
//# sourceMappingURL=index.d.ts.map
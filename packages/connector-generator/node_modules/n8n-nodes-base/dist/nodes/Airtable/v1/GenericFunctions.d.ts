import type { IDataObject, IExecuteFunctions, IPollFunctions, ILoadOptionsFunctions, INodeExecutionData, IPairedItemData, IHttpRequestMethods } from 'n8n-workflow';
interface IAttachment {
    url: string;
    filename: string;
    type: string;
}
export interface IRecord {
    fields: {
        [key: string]: string | IAttachment[];
    };
}
/**
 * Make an API request to Airtable
 *
 */
export declare function apiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated Airtable endpoint
 * and return all results
 *
 * @param {(IExecuteFunctions | IExecuteFunctions)} this
 */
export declare function apiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any>;
export declare function downloadRecordAttachments(this: IExecuteFunctions | IPollFunctions, records: IRecord[], fieldNames: string[], pairedItem?: IPairedItemData[]): Promise<INodeExecutionData[]>;
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map
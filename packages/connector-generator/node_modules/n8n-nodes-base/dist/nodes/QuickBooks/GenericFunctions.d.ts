import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions } from 'n8n-workflow';
import type { DateFieldsUi, Option, TransactionReport } from './types';
/**
 * Make an authenticated API request to QuickBooks.
 */
export declare function quickBooksApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject, body: IDataObject, option?: IDataObject): Promise<any>;
/**
 * Make an authenticated API request to QuickBooks and return all results.
 */
export declare function quickBooksApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject, body: IDataObject, resource: string): Promise<any>;
/**
 * Handles a QuickBooks listing by returning all items or up to a limit.
 */
export declare function handleListing(this: IExecuteFunctions, i: number, endpoint: string, resource: string): Promise<any>;
/**
 * Get the SyncToken required for delete and void operations in QuickBooks.
 */
export declare function getSyncToken(this: IExecuteFunctions, i: number, companyId: string, resource: string): Promise<any>;
/**
 * Get the reference and SyncToken required for update operations in QuickBooks.
 */
export declare function getRefAndSyncToken(this: IExecuteFunctions, i: number, companyId: string, resource: string, ref: string): Promise<{
    ref: any;
    syncToken: any;
}>;
/**
 * Populate node items with binary data.
 */
export declare function handleBinaryData(this: IExecuteFunctions, items: INodeExecutionData[], i: number, companyId: string, resource: string, resourceId: string): Promise<INodeExecutionData[]>;
export declare function loadResource(this: ILoadOptionsFunctions, resource: string): Promise<INodePropertyOptions[]>;
/**
 * Populate the `Line` property in a request body.
 */
export declare function processLines(this: IExecuteFunctions, lines: IDataObject[], resource: string): IDataObject[];
/**
 * Populate update fields or additional fields into a request body.
 */
export declare function populateFields(this: IExecuteFunctions, body: IDataObject, fields: IDataObject, resource: string): IDataObject;
export declare const toOptions: (option: string) => {
    name: string;
    value: string;
};
export declare const splitPascalCase: (word: string) => string;
export declare const toDisplayName: ({ name, value }: Option) => INodePropertyOptions;
export declare function adjustTransactionDates(transactionFields: IDataObject & DateFieldsUi): IDataObject;
export declare function simplifyTransactionReport(transactionReport: TransactionReport): {
    [key: string]: string;
}[];
//# sourceMappingURL=GenericFunctions.d.ts.map
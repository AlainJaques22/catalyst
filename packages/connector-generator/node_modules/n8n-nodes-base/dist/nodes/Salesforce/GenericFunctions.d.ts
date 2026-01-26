import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, INodePropertyOptions, IHttpRequestMethods, IPollFunctions } from 'n8n-workflow';
export declare function salesforceApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function salesforceApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
/**
 * Sorts the given options alphabetically
 *
 */
export declare function sortOptions(options: INodePropertyOptions[]): void;
export declare function getValue(value: any): any;
export declare function getConditions(options: IDataObject): string | undefined;
export declare function getDefaultFields(sobject: string): IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
export declare function getQuery(options: IDataObject, sobject: string, returnAll: boolean, limit?: number): string;
/**
 * Calculates the polling start date with safety margin to account for Salesforce indexing delays
 */
export declare function getPollStartDate(lastTimeChecked: string | undefined): string;
/**
 * Filters out already processed items and manages the processed IDs list
 */
export declare function filterAndManageProcessedItems(responseData: IDataObject[], processedIds: string[]): {
    newItems: IDataObject[];
    updatedProcessedIds: string[];
};
//# sourceMappingURL=GenericFunctions.d.ts.map
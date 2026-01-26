import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function theHiveApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function mapResource(resource: string): string;
export declare function splitTags(tags: string): string[];
export declare function prepareOptional(optionals: IDataObject): IDataObject;
export declare function prepareCustomFields(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, additionalFields: IDataObject, jsonParameters?: boolean): Promise<IDataObject | undefined>;
export declare function buildCustomFieldSearch(customFields: IDataObject): IDataObject[];
export declare function prepareSortQuery(sort: string, body: {
    query: [IDataObject];
}): void;
export declare function prepareRangeQuery(range: string, body: {
    query: IDataObject[];
}): void;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, INodeProperties, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
import type { Filter, Address, Search, ProductAttribute } from './types';
export declare function magentoApiRequest(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, _headers?: IDataObject, option?: IDataObject): Promise<any>;
export declare function magentoApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, propertyName: string, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject): Promise<any>;
export declare function getAddressesUi(): INodeProperties;
export declare function adjustAddresses(addresses: Array<{
    street: string;
    [key: string]: string;
}>): Address[];
export declare function getSearchFilters(resource: string, filterableAttributeFunction: string, sortableAttributeFunction: string): INodeProperties[];
export declare function getFilterQuery(data: {
    conditions?: Filter[];
    matchType: string;
    sort: [{
        direction: string;
        field: string;
    }];
}): Search;
export declare function validateJSON(json: string | undefined): any;
export declare function getCustomerOptionalFields(): INodeProperties[];
export declare function getProductOptionalFields(): INodeProperties[];
export declare function getOrderFields(): string[];
export declare const sort: (a: {
    name: string;
}, b: {
    name: string;
}) => 1 | 0 | -1;
export declare function getProductAttributes(this: ILoadOptionsFunctions, filter?: (attribute: ProductAttribute) => any, extraValue?: {
    name: string;
    value: string;
}): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
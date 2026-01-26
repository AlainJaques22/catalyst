import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, INodeProperties, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
export declare function microsoftApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function getPicklistOptions(this: ILoadOptionsFunctions, entityName: string, attributeName: string): Promise<INodePropertyOptions[]>;
export declare function getEntityFields(this: ILoadOptionsFunctions, entityName: string): Promise<IField[]>;
export declare function adjustAddresses(addresses: [{
    [key: string]: string;
}]): {
    [key: string]: any;
};
export declare function getAccountFields(): INodeProperties[];
export declare const sort: (a: {
    name: string;
}, b: {
    name: string;
}) => 1 | 0 | -1;
export interface IField {
    IsRetrievable: boolean;
    LogicalName: string;
    IsSearchable: string;
    IsValidODataAttribute: string;
    IsValidForRead: string;
    CanBeSecuredForRead: string;
    AttributeType: string;
    IsSortableEnabled: {
        Value: boolean;
    };
    DisplayName: {
        UserLocalizedLabel: {
            Label: string;
        };
    };
}
//# sourceMappingURL=GenericFunctions.d.ts.map
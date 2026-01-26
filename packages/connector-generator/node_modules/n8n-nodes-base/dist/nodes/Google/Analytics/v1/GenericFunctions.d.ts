import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject, uri?: string): Promise<IDataObject[]>;
export declare function simplify(responseData: any | [any]): IDataObject[];
export declare function merge(responseData: [any]): {
    columnHeader: IDataObject;
    data: {
        rows: [];
    };
}[];
//# sourceMappingURL=GenericFunctions.d.ts.map
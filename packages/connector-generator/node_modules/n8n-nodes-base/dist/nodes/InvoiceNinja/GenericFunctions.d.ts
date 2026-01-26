import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare const eventID: {
    [key: string]: string;
};
export declare function invoiceNinjaApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject, uri?: string): Promise<any>;
export declare function invoiceNinjaApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
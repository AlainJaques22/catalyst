import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
interface IContact {
    tags: [];
    base: IDataObject;
    extra: IDataObject[];
}
export declare function egoiApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, qs?: IDataObject, _headers?: object): Promise<any>;
export declare function getFields(this: IExecuteFunctions, listId: string): Promise<IDataObject[]>;
export declare function egoiApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function simplify(this: IExecuteFunctions, contacts: IContact[], listId: string): Promise<IDataObject[]>;
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map
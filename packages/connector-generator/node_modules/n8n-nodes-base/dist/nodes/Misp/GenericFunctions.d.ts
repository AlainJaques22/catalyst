import type { IExecuteFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function mispApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function mispApiRequestAllItems(this: IExecuteFunctions, endpoint: string): Promise<any>;
export declare function mispApiRestSearch(this: IExecuteFunctions, resource: 'attributes' | 'events' | 'objects', itemIndex: number): Promise<any>;
export declare function throwOnEmptyUpdate(this: IExecuteFunctions, resource: string, updateFields: IDataObject): void;
export declare function throwOnMissingSharingGroup(this: IExecuteFunctions, fields: IDataObject): void;
export declare function throwOnInvalidUrl(this: IExecuteFunctions, str: string): void;
//# sourceMappingURL=GenericFunctions.d.ts.map
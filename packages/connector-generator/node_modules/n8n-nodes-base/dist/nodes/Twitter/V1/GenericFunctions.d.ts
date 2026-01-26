import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function twitterApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function twitterApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
export declare function chunks(buffer: Buffer, chunkSize: number): Buffer<ArrayBuffer>[];
export declare function uploadAttachments(this: IExecuteFunctions, binaryProperties: string[], i: number): Promise<IDataObject[] | undefined>;
//# sourceMappingURL=GenericFunctions.d.ts.map
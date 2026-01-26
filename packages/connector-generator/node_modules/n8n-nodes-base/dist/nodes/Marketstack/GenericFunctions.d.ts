import type { IExecuteFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function marketstackApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function marketstackApiRequestAllItems(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject[]>;
export declare const format: (datetime?: string) => string | undefined;
export declare function validateTimeOptions(this: IExecuteFunctions, timeOptions: boolean[]): void;
//# sourceMappingURL=GenericFunctions.d.ts.map
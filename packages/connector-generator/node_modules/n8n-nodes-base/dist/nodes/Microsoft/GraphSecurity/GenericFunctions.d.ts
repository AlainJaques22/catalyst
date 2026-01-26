import type { IExecuteFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function msGraphSecurityApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, headers?: IDataObject): Promise<any>;
export declare function tolerateDoubleQuotes(filterQueryParameter: string): string;
export declare function throwOnEmptyUpdate(this: IExecuteFunctions): void;
//# sourceMappingURL=GenericFunctions.d.ts.map
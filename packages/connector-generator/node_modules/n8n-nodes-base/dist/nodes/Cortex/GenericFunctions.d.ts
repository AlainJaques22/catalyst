import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function cortexApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function getEntityLabel(entity: IDataObject): string;
export declare function splitTags(tags: string): string[];
export declare function prepareParameters(values: IDataObject): IDataObject;
//# sourceMappingURL=GenericFunctions.d.ts.map
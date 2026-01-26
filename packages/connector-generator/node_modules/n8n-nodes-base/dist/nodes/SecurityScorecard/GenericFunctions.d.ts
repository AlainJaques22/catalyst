import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function scorecardApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function simplify(data: IDataObject[]): IDataObject[];
//# sourceMappingURL=GenericFunctions.d.ts.map
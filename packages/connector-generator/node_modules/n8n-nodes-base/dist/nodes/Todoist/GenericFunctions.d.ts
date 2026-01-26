import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export type Context = IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions;
export declare function FormatDueDatetime(isoString: string): string;
export declare function todoistApiRequest(this: Context, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function todoistSyncRequest(this: Context, body?: any, qs?: IDataObject, endpoint?: string): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
export declare function facebookApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, _option?: IDataObject): Promise<any>;
export declare function getFields(object: string): {
    name: string;
}[];
export declare function getAllFields(object: string): (IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[])[];
//# sourceMappingURL=GenericFunctions.d.ts.map
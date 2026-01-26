import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
export declare function strapiApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function getToken(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions): Promise<{
    jwt: string;
}>;
export declare function strapiApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, query?: IDataObject, headers?: IDataObject, apiVersion?: string): Promise<IDataObject[]>;
export declare function validateJSON(json: string | undefined): any;
//# sourceMappingURL=GenericFunctions.d.ts.map
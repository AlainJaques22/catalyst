import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestMethods, INodePropertyOptions } from 'n8n-workflow';
export declare function webflowApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function webflowApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject[]>;
export declare function getSites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function getCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function getFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
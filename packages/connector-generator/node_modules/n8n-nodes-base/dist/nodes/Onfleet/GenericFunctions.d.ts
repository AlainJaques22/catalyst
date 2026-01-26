import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions, IWebhookFunctions } from 'n8n-workflow';
export declare function onfleetApiRequest(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: any, uri?: string): Promise<any>;
export declare function onfleetApiRequestAllItems(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare const resourceLoaders: {
    getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
    getWorkers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
    getAdmins(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
    getHubs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
    getTimezones(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
};
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
export declare function homeAssistantApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function getHomeAssistantEntities(this: IExecuteFunctions | ILoadOptionsFunctions, domain?: string): Promise<INodePropertyOptions[]>;
export declare function getHomeAssistantServices(this: IExecuteFunctions | ILoadOptionsFunctions, domain?: string): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
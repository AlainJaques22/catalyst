import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Make an authenticated API request to GoToWebinar.
 */
export declare function goToWebinarApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs: IDataObject, body: IDataObject | IDataObject[], option?: IDataObject): Promise<any>;
/**
 * Make an authenticated API request to GoToWebinar and return all results.
 */
export declare function goToWebinarApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, query: IDataObject, body: IDataObject, resource: string): Promise<IDataObject[]>;
export declare function handleGetAll(this: IExecuteFunctions, endpoint: string, qs: IDataObject, body: IDataObject, resource: string): Promise<IDataObject[]>;
export declare function loadWebinars(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function loadWebinarSessions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function loadRegistranSimpleQuestions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function loadAnswers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function loadRegistranMultiChoiceQuestions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
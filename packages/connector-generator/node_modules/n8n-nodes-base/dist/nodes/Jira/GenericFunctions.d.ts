import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeListSearchItems, INodePropertyOptions } from 'n8n-workflow';
import type { JiraServerInfo, JiraWebhook } from './types';
export declare function jiraSoftwareCloudApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, endpoint: string, method: IHttpRequestMethods, body?: any, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function handlePagination(method: IHttpRequestMethods, body: any, query: IDataObject, paginationType: 'offset' | 'token', responseData?: any): boolean;
export declare function jiraSoftwareCloudApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, endpoint: string, method: IHttpRequestMethods, body?: any, query?: IDataObject, paginationType?: 'offset' | 'token'): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
export declare function eventExists(currentEvents: string[], webhookEvents: string[]): boolean;
export declare function getWebhookId(webhook: JiraWebhook): string | undefined;
export declare function simplifyIssueOutput(responseData: {
    names: {
        [key: string]: string;
    };
    fields: IDataObject;
    id: string;
    key: string;
    self: string;
}): IDataObject;
export declare const allEvents: string[];
export declare function filterSortSearchListItems(items: INodeListSearchItems[], filter?: string): INodeListSearchItems[];
export declare function getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function getServerInfo(this: IHookFunctions): Promise<JiraServerInfo>;
export declare function getWebhookEndpoint(this: IHookFunctions): Promise<"/webhooks/1.0/webhook" | "/jira-webhook/1.0/webhooks">;
//# sourceMappingURL=GenericFunctions.d.ts.map
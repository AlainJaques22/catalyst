import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { LoadedResource, Resource } from './types';
export declare function getAuthorization(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, credentials?: ICredentialDataDecryptedObject): Promise<string>;
export declare function taigaApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: {}, query?: {}, uri?: string, option?: {}): Promise<any>;
export declare function taigaApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, query?: IDataObject): Promise<any>;
export declare function getAutomaticSecret(credentials: ICredentialDataDecryptedObject): string;
export declare function handleListing(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, qs: IDataObject, i: number): Promise<any>;
export declare const toOptions: (items: LoadedResource[]) => {
    name: string;
    value: string;
}[];
export declare function throwOnEmptyUpdate(this: IExecuteFunctions, resource: Resource): void;
export declare function getVersionForUpdate(this: IExecuteFunctions, endpoint: string): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map
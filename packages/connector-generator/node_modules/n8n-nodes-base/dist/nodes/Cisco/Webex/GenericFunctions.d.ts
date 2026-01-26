import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeProperties, IWebhookFunctions } from 'n8n-workflow';
export declare function webexApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function webexApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject, options?: IDataObject): Promise<any>;
export declare function getEvents(): INodeProperties[];
export declare function mapResource(event: string): string;
export declare function getAttachments(attachments: IDataObject[]): IDataObject[];
export declare function getActionInheritedProperties(): INodeProperties[];
export declare function getTextBlockProperties(): INodeProperties[];
export declare function getInputTextProperties(): INodeProperties[];
export declare function getAutomaticSecret(credentials: ICredentialDataDecryptedObject): string;
//# sourceMappingURL=GenericFunctions.d.ts.map
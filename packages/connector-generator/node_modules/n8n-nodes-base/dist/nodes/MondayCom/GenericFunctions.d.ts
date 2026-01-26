import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHookFunctions, IWebhookFunctions } from 'n8n-workflow';
export declare function mondayComApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, body?: any, option?: IDataObject): Promise<any>;
export declare function mondayComApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, body?: any): Promise<any>;
export declare function mondayComApiPaginatedRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, itemsPath: string, fieldsToReturn: string, body?: IDataObject): Promise<IDataObject[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
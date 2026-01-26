import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeExecutionData } from 'n8n-workflow';
export declare function microsoftApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject, option?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject, headers?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItemsSkip(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject, headers?: IDataObject): Promise<any>;
export declare function makeRecipient(email: string): {
    emailAddress: {
        address: string;
    };
};
export declare function createMessage(fields: IDataObject): IDataObject;
export declare function downloadAttachments(this: IExecuteFunctions, messages: IDataObject[] | IDataObject, prefix: string): Promise<INodeExecutionData[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function microsoftApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItemsSkip(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function prepareMessage(this: IExecuteFunctions | ILoadOptionsFunctions, message: string, messageType: string, includeLinkToWorkflow: boolean, instanceId?: string): {
    body: {
        contentType: string;
        content: string;
    };
};
//# sourceMappingURL=GenericFunctions.d.ts.map
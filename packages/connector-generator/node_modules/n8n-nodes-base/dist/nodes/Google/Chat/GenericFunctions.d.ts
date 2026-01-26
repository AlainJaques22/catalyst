import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeProperties } from 'n8n-workflow';
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, noCredentials?: boolean, encoding?: null): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
export declare function getPagingParameters(resource: string, operation?: string): INodeProperties[];
export declare function createSendAndWaitMessageBody(context: IExecuteFunctions): {
    text: string;
};
//# sourceMappingURL=GenericFunctions.d.ts.map
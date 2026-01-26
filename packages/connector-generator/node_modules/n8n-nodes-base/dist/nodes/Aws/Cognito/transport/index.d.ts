import type { ILoadOptionsFunctions, IPollFunctions, IExecuteSingleFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function awsApiRequest(this: ILoadOptionsFunctions | IPollFunctions | IExecuteSingleFunctions, method: IHttpRequestMethods, action: string, body: string): Promise<any>;
export declare function awsApiRequestAllItems(this: ILoadOptionsFunctions | IPollFunctions | IExecuteSingleFunctions, method: IHttpRequestMethods, action: string, body: IDataObject, propertyName: string): Promise<IDataObject[]>;
//# sourceMappingURL=index.d.ts.map
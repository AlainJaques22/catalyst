import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, uri?: string): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, uri?: string): Promise<any>;
export declare const hasKeys: (obj?: {}) => boolean;
export declare const extractID: (url: string) => string | undefined;
export declare const upperFirst: (str: string) => string;
//# sourceMappingURL=GenericFunctions.d.ts.map
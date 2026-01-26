import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function freshdeskApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function freshdeskApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<IDataObject[]>;
export declare function validateJSON(json: string | undefined): any;
export declare function capitalize(s: string): string;
//# sourceMappingURL=GenericFunctions.d.ts.map
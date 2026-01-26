import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export interface IGoogleAuthCredentials {
    delegatedEmail?: string;
    email: string;
    inpersonate: boolean;
    privateKey: string;
}
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function hexToRgb(hex: string): {
    red: number;
    green: number;
    blue: number;
} | null;
//# sourceMappingURL=GenericFunctions.d.ts.map
import type { ICredentialDataDecryptedObject, ICredentialTestFunctions, IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IPollFunctions } from 'n8n-workflow';
interface IHaloPSATokens {
    scope: string;
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    id_token: string;
}
export declare function getAccessTokens(this: IExecuteFunctions | ILoadOptionsFunctions): Promise<IHaloPSATokens>;
export declare function haloPSAApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, resource: string, accessToken: string, body?: IDataObject | IDataObject[], qs?: IDataObject, option?: IDataObject): Promise<any>;
export declare function haloPSAApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, accessToken: string, body?: {}, query?: IDataObject): Promise<any>;
export declare function simplifyHaloPSAGetOutput(response: IDataObject[], fieldsList: string[]): IDataObject[];
export declare function qsSetStatus(status: string): IDataObject;
export declare function validateCredentials(this: ICredentialTestFunctions, decryptedCredentials: ICredentialDataDecryptedObject): Promise<IHaloPSATokens>;
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map
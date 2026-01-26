import type { ICredentialDataDecryptedObject, ICredentialType, IHttpRequestOptions, INodeProperties, Icon } from 'n8n-workflow';
export declare class GoogleApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    properties: INodeProperties[];
    authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
}
//# sourceMappingURL=GoogleApi.credentials.d.ts.map
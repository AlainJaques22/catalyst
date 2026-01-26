import type { ICredentialDataDecryptedObject, ICredentialTestRequest, ICredentialType, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
export declare class ElasticSecurityApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=ElasticSecurityApi.credentials.d.ts.map
import type { ICredentialDataDecryptedObject, ICredentialTestRequest, ICredentialType, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
export declare class AzureStorageSharedKeyApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=AzureStorageSharedKeyApi.credentials.d.ts.map
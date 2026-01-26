import type { ICredentialDataDecryptedObject, ICredentialType, ICredentialTestRequest, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
export declare class MicrosoftAzureCosmosDbSharedKeyApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=MicrosoftAzureCosmosDbSharedKeyApi.credentials.d.ts.map
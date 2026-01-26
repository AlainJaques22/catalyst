import type { IAuthenticate, ICredentialDataDecryptedObject, ICredentialTestRequest, ICredentialType, IHttpRequestHelper, INodeProperties } from 'n8n-workflow';
export declare class FormIoApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject): Promise<{
        token: any;
    }>;
    authenticate: IAuthenticate;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=FormIoApi.credentials.d.ts.map
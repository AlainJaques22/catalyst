import type { IAuthenticateGeneric, ICredentialDataDecryptedObject, ICredentialTestRequest, ICredentialType, IHttpRequestHelper, INodeProperties, Icon } from 'n8n-workflow';
export declare class ZscalerZiaApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
    preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject): Promise<{
        cookie: string;
    }>;
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=ZscalerZiaApi.credentials.d.ts.map
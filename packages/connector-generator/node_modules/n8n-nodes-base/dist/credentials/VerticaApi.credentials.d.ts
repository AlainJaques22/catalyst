import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class VerticaApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrlPlaceholder: string;
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=VerticaApi.credentials.d.ts.map
import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class DfirIrisApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:icons/DfirIris.svg";
        readonly dark: "file:icons/DfirIris.svg";
    };
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrlPlaceholder: string;
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=DfirIrisApi.credentials.d.ts.map
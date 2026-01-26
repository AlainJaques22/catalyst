import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class QualysApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: "file:icons/Qualys.svg";
    documentationUrl: string;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
//# sourceMappingURL=QualysApi.credentials.d.ts.map
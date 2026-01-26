import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class QRadarApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        readonly light: "file:icons/IBM.svg";
        readonly dark: "file:icons/IBM.dark.svg";
    };
    documentationUrl: string;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
//# sourceMappingURL=QRadarApi.credentials.d.ts.map
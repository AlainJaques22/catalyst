import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class CarbonBlackApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        readonly light: "file:icons/vmware.svg";
        readonly dark: "file:icons/vmware.dark.svg";
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
//# sourceMappingURL=CarbonBlackApi.credentials.d.ts.map
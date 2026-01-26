import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class CiscoMerakiApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:icons/Cisco.svg";
        readonly dark: "file:icons/Cisco.dark.svg";
    };
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
//# sourceMappingURL=CiscoMerakiApi.credentials.d.ts.map
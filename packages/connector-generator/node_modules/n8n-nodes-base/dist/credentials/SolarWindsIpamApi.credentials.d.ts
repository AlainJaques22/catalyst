import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class SolarWindsIpamApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:icons/SolarWindsIpam.svg";
        readonly dark: "file:icons/SolarWindsIpam.svg";
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
//# sourceMappingURL=SolarWindsIpamApi.credentials.d.ts.map
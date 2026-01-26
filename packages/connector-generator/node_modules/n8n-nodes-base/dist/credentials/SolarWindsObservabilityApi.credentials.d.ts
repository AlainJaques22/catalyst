import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class SolarWindsObservabilityApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:icons/SolarWindsObservability.svg";
        readonly dark: "file:icons/SolarWindsObservability.svg";
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
//# sourceMappingURL=SolarWindsObservabilityApi.credentials.d.ts.map
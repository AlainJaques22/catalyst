import type { IAuthenticateGeneric, ICredentialDataDecryptedObject, ICredentialTestRequest, ICredentialType, IHttpRequestHelper, INodeProperties } from 'n8n-workflow';
export declare class CiscoUmbrellaApi implements ICredentialType {
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
    preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject): Promise<{
        sessionToken: string;
    }>;
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=CiscoUmbrellaApi.credentials.d.ts.map
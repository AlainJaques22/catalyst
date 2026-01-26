import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class ImpervaWafApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:icons/Imperva.svg";
        readonly dark: "file:icons/Imperva.dark.svg";
    };
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
//# sourceMappingURL=ImpervaWafApi.credentials.d.ts.map
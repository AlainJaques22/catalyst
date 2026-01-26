import type { IAuthenticateGeneric, ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class TrellixEpoApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
//# sourceMappingURL=TrellixEpoApi.credentials.d.ts.map
import type { IAuthenticateGeneric, ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class HttpHeaderAuth implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    genericAuth: boolean;
    icon: Icon;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
//# sourceMappingURL=HttpHeaderAuth.credentials.d.ts.map
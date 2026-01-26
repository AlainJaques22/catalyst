import type { IAuthenticateGeneric, ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class HttpBearerAuth implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    genericAuth: boolean;
    icon: Icon;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
//# sourceMappingURL=HttpBearerAuth.credentials.d.ts.map
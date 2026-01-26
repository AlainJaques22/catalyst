import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class MiroOAuth2Api implements ICredentialType {
    name: string;
    extends: string[];
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
}
//# sourceMappingURL=MiroOAuth2Api.credentials.d.ts.map
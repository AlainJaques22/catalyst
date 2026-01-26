import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class MicrosoftSharePointOAuth2Api implements ICredentialType {
    name: string;
    extends: string[];
    icon: Icon;
    displayName: string;
    documentationUrl: string;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrlPlaceholder: string;
    };
    properties: INodeProperties[];
}
//# sourceMappingURL=MicrosoftSharePointOAuth2Api.credentials.d.ts.map
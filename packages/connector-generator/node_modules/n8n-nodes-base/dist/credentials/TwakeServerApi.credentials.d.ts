import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class TwakeServerApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: Icon;
    documentationUrl: string;
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrl: string;
    };
    properties: INodeProperties[];
}
//# sourceMappingURL=TwakeServerApi.credentials.d.ts.map
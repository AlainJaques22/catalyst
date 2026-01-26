import type { ICredentialDataDecryptedObject, ICredentialTestRequest, ICredentialType, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
export declare class DatadogApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:icons/Datadog.svg";
        readonly dark: "file:icons/Datadog.svg";
    };
    httpRequestNode: {
        name: string;
        docsUrl: string;
        apiBaseUrlPlaceholder: string;
    };
    properties: INodeProperties[];
    authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=DatadogApi.credentials.d.ts.map
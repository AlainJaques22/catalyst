import type { ICredentialDataDecryptedObject, ICredentialType, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
export declare class AwsAssumeRole implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: {
        readonly light: "file:icons/AWS.svg";
        readonly dark: "file:icons/AWS.dark.svg";
    };
    properties: INodeProperties[];
    authenticate(decryptedCredentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
    test: import("n8n-workflow").ICredentialTestRequest;
}
//# sourceMappingURL=AwsAssumeRole.credentials.d.ts.map
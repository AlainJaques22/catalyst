export declare const AWS_CHINA_DOMAIN = "amazonaws.com.cn";
export declare const AWS_GLOBAL_DOMAIN = "amazonaws.com";
type RegionData = {
    name: string;
    displayName: string;
    location: string;
    domain?: string;
};
export declare const regions: RegionData[];
export type AWSRegion = (typeof regions)[number]['name'];
export type AwsCredentialsTypeBase = {
    region: AWSRegion;
    customEndpoints: boolean;
    rekognitionEndpoint?: string;
    lambdaEndpoint?: string;
    snsEndpoint?: string;
    sesEndpoint?: string;
    sqsEndpoint?: string;
    s3Endpoint?: string;
    ssmEndpoint?: string;
};
export type AwsIamCredentialsType = AwsCredentialsTypeBase & {
    accessKeyId: string;
    secretAccessKey: string;
    temporaryCredentials: boolean;
    sessionToken?: string;
};
export type AwsAssumeRoleCredentialsType = AwsCredentialsTypeBase & {
    assumeRole?: boolean;
    roleArn?: string;
    externalId?: string;
    roleSessionName?: string;
    useSystemCredentialsForRole?: boolean;
    stsAccessKeyId?: string;
    stsSecretAccessKey?: string;
    stsSessionToken?: string;
};
export type AwsSecurityHeaders = {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string | undefined;
};
export {};
//# sourceMappingURL=types.d.ts.map
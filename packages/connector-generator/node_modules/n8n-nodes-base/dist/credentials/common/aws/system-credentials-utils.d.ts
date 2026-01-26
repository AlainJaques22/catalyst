type Resolvers = 'environment' | 'podIdentity' | 'containerMetadata' | 'instanceMetadata';
type RetrunData = {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
};
export declare const envGetter: (key: string) => string | undefined;
export declare const credentialsResolver: Record<Resolvers, () => Promise<RetrunData | null>>;
/**
 * Retrieves AWS credentials from various system sources following the AWS credential chain.
 * Attempts to get credentials in the following order:
 * 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
 * 2. EKS Pod Identity (AWS_CONTAINER_CREDENTIALS_FULL_URI)
 * 3. ECS/Fargate container metadata (AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)
 * 4. EC2 instance metadata service
 */
export declare function getSystemCredentials(): Promise<{
    source: Resolvers;
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
} | null>;
export {};
//# sourceMappingURL=system-credentials-utils.d.ts.map
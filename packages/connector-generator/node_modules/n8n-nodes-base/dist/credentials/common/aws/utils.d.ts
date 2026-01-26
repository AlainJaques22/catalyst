import { type IHttpRequestMethods, type ICredentialTestRequest, type IHttpRequestOptions } from 'n8n-workflow';
import type { Request } from 'aws4';
import { type AwsCredentialsTypeBase, type AWSRegion, type AwsAssumeRoleCredentialsType, type AwsSecurityHeaders } from './types';
/**
 * Gets the AWS domain for a specific region.
 *
 * @param region - The AWS region to get the domain for
 * @returns The AWS domain for the region, or the global domain if region not found
 */
export declare function getAwsDomain(region: AWSRegion): string;
/**
 * Parses an AWS service URL to extract the service name and region.
 * Some AWS services are global and don't have a region.
 *
 * @param url - The AWS service URL to parse
 * @returns Object containing the service name and region (null for global services)
 *
 * @see {@link https://docs.aws.amazon.com/general/latest/gr/rande.html#global-endpoints AWS Global Endpoints}
 */
export declare function parseAwsUrl(url: URL): {
    region: AWSRegion | null;
    service: string;
};
/**
 * AWS credentials test configuration for validating AWS credentials.
 * Uses the STS GetCallerIdentity action to verify that the provided credentials are valid.
 * Automatically handles both standard AWS regions and China regions with appropriate endpoints.
 */
export declare const awsCredentialsTest: ICredentialTestRequest;
/**
 * Prepares AWS request options for signing by constructing the proper endpoint URL,
 * handling query parameters, and setting up the request body for AWS4 signature.
 *
 * This function handles multiple scenarios:
 * - Custom service endpoints from credentials
 * - Default AWS service endpoints
 * - URI-based requests (legacy IRequestOptions interface)
 * - Form data conversion to URL-encoded format
 * - Special handling for STS GetCallerIdentity requests
 *
 * @param requestOptions - The HTTP request options to modify
 * @param credentials - AWS credentials containing potential custom endpoints
 * @param path - The API path to append to the endpoint
 * @param method - HTTP method for the request
 * @param service - AWS service name (e.g., 's3', 'lambda', 'sts')
 * @param region - AWS region for the request
 * @returns Object containing signing options and the constructed endpoint URL
 */
export declare function awsGetSignInOptionsAndUpdateRequest(requestOptions: IHttpRequestOptions, credentials: AwsCredentialsTypeBase, path: string, method: string | undefined, service: string, region: AWSRegion): {
    signOpts: Request;
    url: string;
};
/**
 * Assumes an AWS IAM role using STS (Security Token Service) and returns temporary credentials.
 * This function supports two modes for providing credentials for the STS call:
 * 1. Using system credentials (environment variables, instance metadata, etc.)
 * 2. Using manually provided STS credentials
 *
 * @param credentials - The assume role credentials configuration
 * @param region - AWS region for the STS endpoint
 * @returns Promise resolving to temporary credentials for the assumed role
 * @throws {ApplicationError} When credentials are invalid or STS call fails
 *
 * @see {@link https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html STS AssumeRole API}
 */
export declare function assumeRole(credentials: AwsAssumeRoleCredentialsType, region: AWSRegion): Promise<{
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
}>;
export declare function signOptions(requestOptions: IHttpRequestOptions, signOpts: Request, securityHeaders: AwsSecurityHeaders, url: string, method?: IHttpRequestMethods): IHttpRequestOptions;
//# sourceMappingURL=utils.d.ts.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsCredentialsTest = void 0;
exports.getAwsDomain = getAwsDomain;
exports.parseAwsUrl = parseAwsUrl;
exports.awsGetSignInOptionsAndUpdateRequest = awsGetSignInOptionsAndUpdateRequest;
exports.assumeRole = assumeRole;
exports.signOptions = signOptions;
const n8n_workflow_1 = require("n8n-workflow");
const xml2js_1 = require("xml2js");
const types_1 = require("./types");
const aws4_1 = require("aws4");
const system_credentials_utils_1 = require("./system-credentials-utils");
/**
 * Checks if a request body value should be JSON stringified for AWS requests.
 * Returns true for plain objects without Content-Length headers.
 */
function shouldStringifyBody(value, headers) {
    if (typeof value === 'object' &&
        value !== null &&
        !headers['Content-Length'] &&
        !headers['content-length'] &&
        !Buffer.isBuffer(value)) {
        return true;
    }
    return false;
}
/**
 * Gets the AWS domain for a specific region.
 *
 * @param region - The AWS region to get the domain for
 * @returns The AWS domain for the region, or the global domain if region not found
 */
function getAwsDomain(region) {
    return types_1.regions.find((r) => r.name === region)?.domain ?? types_1.AWS_GLOBAL_DOMAIN;
}
/**
 * Parses an AWS service URL to extract the service name and region.
 * Some AWS services are global and don't have a region.
 *
 * @param url - The AWS service URL to parse
 * @returns Object containing the service name and region (null for global services)
 *
 * @see {@link https://docs.aws.amazon.com/general/latest/gr/rande.html#global-endpoints AWS Global Endpoints}
 */
function parseAwsUrl(url) {
    const hostname = url.hostname;
    // Handle both .amazonaws.com and .amazonaws.com.cn domains
    const [service, region] = hostname.replace(/\.amazonaws\.com.*$/, '').split('.');
    return { service, region };
}
/**
 * AWS credentials test configuration for validating AWS credentials.
 * Uses the STS GetCallerIdentity action to verify that the provided credentials are valid.
 * Automatically handles both standard AWS regions and China regions with appropriate endpoints.
 */
exports.awsCredentialsTest = {
    request: {
        baseURL: 
        // eslint-disable-next-line n8n-local-rules/no-interpolation-in-regular-string
        '={{$credentials.region.startsWith("cn-") ? `https://sts.${$credentials.region}.amazonaws.com.cn` : `https://sts.${$credentials.region}.amazonaws.com`}}',
        url: '?Action=GetCallerIdentity&Version=2011-06-15',
        method: 'POST',
    },
};
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
function awsGetSignInOptionsAndUpdateRequest(requestOptions, credentials, path, method, service, region) {
    let body = requestOptions.body;
    let endpoint;
    let query = requestOptions.qs?.query;
    // ! Workaround as we still use the IRequestOptions interface which uses uri instead of url
    // ! To change when we replace the interface with IHttpRequestOptions
    const requestWithUri = requestOptions;
    if (requestWithUri.uri) {
        requestOptions.url = requestWithUri.uri;
        endpoint = new URL(requestOptions.url);
        if (service === 'sts') {
            try {
                if (requestWithUri.qs?.Action !== 'GetCallerIdentity') {
                    query = requestWithUri.qs;
                }
                else {
                    endpoint.searchParams.set('Action', 'GetCallerIdentity');
                    endpoint.searchParams.set('Version', '2011-06-15');
                }
            }
            catch (err) {
                console.error(err);
            }
        }
        const parsed = parseAwsUrl(endpoint);
        service = parsed.service;
        if (parsed.region) {
            region = parsed.region;
        }
    }
    else {
        if (!requestOptions.baseURL && !requestOptions.url) {
            let endpointString;
            if (service === 'lambda' && credentials.lambdaEndpoint) {
                endpointString = credentials.lambdaEndpoint;
            }
            else if (service === 'sns' && credentials.snsEndpoint) {
                endpointString = credentials.snsEndpoint;
            }
            else if (service === 'sqs' && credentials.sqsEndpoint) {
                endpointString = credentials.sqsEndpoint;
            }
            else if (service === 's3' && credentials.s3Endpoint) {
                endpointString = credentials.s3Endpoint;
            }
            else if (service === 'ses' && credentials.sesEndpoint) {
                endpointString = credentials.sesEndpoint;
            }
            else if (service === 'rekognition' && credentials.rekognitionEndpoint) {
                endpointString = credentials.rekognitionEndpoint;
            }
            else if (service === 'ssm' && credentials.ssmEndpoint) {
                endpointString = credentials.ssmEndpoint;
            }
            else if (service) {
                const domain = getAwsDomain(region);
                endpointString = `https://${service}.${region}.${domain}`;
            }
            endpoint = new URL(endpointString.replace('{region}', region) + path);
        }
        else {
            // If no endpoint is set, we try to decompose the path and use the default endpoint
            const customUrl = new URL(`${requestOptions.baseURL}${requestOptions.url}${path}`);
            const parsed = parseAwsUrl(customUrl);
            service = parsed.service;
            if (parsed.region) {
                region = parsed.region;
            }
            if (service === 'sts') {
                try {
                    customUrl.searchParams.set('Action', 'GetCallerIdentity');
                    customUrl.searchParams.set('Version', '2011-06-15');
                }
                catch (err) {
                    console.error(err);
                }
            }
            endpoint = customUrl;
        }
    }
    if (query && Object.keys(query).length !== 0) {
        Object.keys(query).forEach((key) => {
            endpoint.searchParams.append(key, query[key]);
        });
    }
    if (body && typeof body === 'object' && (0, n8n_workflow_1.isObjectEmpty)(body)) {
        body = '';
    }
    path = endpoint.pathname + endpoint.search;
    // ! aws4.sign *must* have the body to sign, but we might have .form instead of .body
    const requestWithForm = requestOptions;
    let bodyContent = body !== '' ? body : undefined;
    let contentTypeHeader = undefined;
    if (shouldStringifyBody(bodyContent, requestOptions.headers ?? {})) {
        bodyContent = JSON.stringify(bodyContent);
    }
    if (requestWithForm.form) {
        const params = new URLSearchParams();
        for (const key in requestWithForm.form) {
            params.append(key, requestWithForm.form[key]);
        }
        bodyContent = params.toString();
        contentTypeHeader = 'application/x-www-form-urlencoded';
    }
    const signOpts = {
        ...requestOptions,
        headers: {
            ...(requestOptions.headers ?? {}),
            ...(contentTypeHeader && { 'content-type': contentTypeHeader }),
        },
        host: endpoint.host,
        method,
        path,
        body: bodyContent,
        region,
    };
    return { signOpts, url: endpoint.origin + path };
}
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
async function assumeRole(credentials, region) {
    let stsCallCredentials;
    const useSystemCredentialsForRole = credentials.useSystemCredentialsForRole ?? false;
    if (useSystemCredentialsForRole) {
        const systemCredentials = await (0, system_credentials_utils_1.getSystemCredentials)();
        if (!systemCredentials) {
            throw new n8n_workflow_1.ApplicationError('System AWS credentials are required for role assumption. Please ensure AWS credentials are available via environment variables, instance metadata, or container role.');
        }
        if (systemCredentials.source !== 'environment') {
            return {
                accessKeyId: systemCredentials.accessKeyId,
                secretAccessKey: systemCredentials.secretAccessKey,
                sessionToken: systemCredentials.sessionToken,
            };
        }
        stsCallCredentials = systemCredentials;
    }
    else {
        if (!credentials.stsAccessKeyId || credentials.stsAccessKeyId.trim() === '') {
            throw new n8n_workflow_1.ApplicationError('STS Access Key ID is required when not using system credentials.');
        }
        if (!credentials.stsSecretAccessKey || credentials.stsSecretAccessKey.trim() === '') {
            throw new n8n_workflow_1.ApplicationError('STS Secret Access Key is required when not using system credentials.');
        }
        const sessionToken = credentials.stsSessionToken?.trim() || undefined;
        stsCallCredentials = {
            accessKeyId: credentials.stsAccessKeyId.trim(),
            secretAccessKey: credentials.stsSecretAccessKey.trim(),
            sessionToken,
        };
    }
    const domain = getAwsDomain(region);
    const stsEndpoint = `https://sts.${region}.${domain}`;
    const assumeRoleBody = {
        RoleArn: credentials.roleArn,
        RoleSessionName: credentials.roleSessionName || 'n8n-session',
        ...(credentials.externalId && { ExternalId: credentials.externalId }),
    };
    const params = new URLSearchParams({
        Action: 'AssumeRole',
        Version: '2011-06-15',
        RoleArn: assumeRoleBody.RoleArn,
        RoleSessionName: assumeRoleBody.RoleSessionName,
    });
    if (assumeRoleBody.ExternalId) {
        params.append('ExternalId', assumeRoleBody.ExternalId);
    }
    const bodyContent = params.toString();
    const stsUrl = new URL(stsEndpoint);
    const signOpts = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        host: stsUrl.host,
        method: 'POST',
        path: '/',
        body: bodyContent,
        region,
    };
    try {
        (0, aws4_1.sign)(signOpts, stsCallCredentials);
    }
    catch (err) {
        console.error('Failed to sign STS request:', err);
        throw new n8n_workflow_1.ApplicationError('Failed to sign STS request');
    }
    const response = await fetch(stsEndpoint, {
        method: 'POST',
        headers: signOpts.headers,
        body: bodyContent,
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new n8n_workflow_1.ApplicationError(`STS AssumeRole failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const responseText = await response.text();
    const responseData = await new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(responseText, { explicitArray: false }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
    const assumeRoleResult = responseData.AssumeRoleResponse
        ?.AssumeRoleResult;
    if (!assumeRoleResult?.Credentials) {
        throw new n8n_workflow_1.ApplicationError('Invalid response from STS AssumeRole');
    }
    const assumedCredentials = assumeRoleResult.Credentials;
    const securityHeaders = {
        accessKeyId: assumedCredentials.AccessKeyId,
        secretAccessKey: assumedCredentials.SecretAccessKey,
        sessionToken: assumedCredentials.SessionToken,
    };
    return securityHeaders;
}
function signOptions(requestOptions, signOpts, securityHeaders, url, method) {
    try {
        (0, aws4_1.sign)(signOpts, securityHeaders);
    }
    catch (err) {
        console.error(err);
    }
    const options = {
        ...requestOptions,
        headers: signOpts.headers,
        method,
        url,
        body: signOpts.body,
        qs: undefined, // override since it's already in the url
    };
    return options;
}
//# sourceMappingURL=utils.js.map
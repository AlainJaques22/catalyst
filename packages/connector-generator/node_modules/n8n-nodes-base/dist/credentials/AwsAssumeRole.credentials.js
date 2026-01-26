"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsAssumeRole = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./common/aws/descriptions");
const utils_1 = require("./common/aws/utils");
class AwsAssumeRole {
    name = 'awsAssumeRole';
    displayName = 'AWS (Assume Role)';
    documentationUrl = 'awsassumerole';
    icon = { light: 'file:icons/AWS.svg', dark: 'file:icons/AWS.dark.svg' };
    properties = [
        descriptions_1.awsRegionProperty,
        {
            displayName: 'Use System Credentials',
            name: 'useSystemCredentialsForRole',
            description: 'Use system credentials (environment variables, container role, etc.) to call STS.AssumeRole. Access to AWS system credentials is disabled by default and must be explicitly enabled. See <a href="https://docs.n8n.io/integrations/credentials/awsassumerole/">documentation</a> for more information.',
            type: 'boolean',
            default: false,
            displayOptions: {
                hideOnCloud: true,
            },
        },
        {
            displayName: 'STS Access Key ID',
            name: 'stsAccessKeyId',
            description: 'Access Key ID to use for the STS.AssumeRole call',
            // eslint-disable-next-line n8n-nodes-base/cred-class-field-type-options-password-missing
            type: 'string',
            displayOptions: {
                show: {
                    useSystemCredentialsForRole: [false],
                },
            },
            required: true,
            default: '',
        },
        {
            displayName: 'STS Access Key Secret',
            name: 'stsSecretAccessKey',
            description: 'Secret Access Key to use for the STS.AssumeRole call',
            type: 'string',
            displayOptions: {
                show: {
                    useSystemCredentialsForRole: [false],
                },
            },
            required: true,
            default: '',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'STS Session Token (optional)',
            name: 'stsSessionToken',
            description: 'Session Token to use for the STS.AssumeRole call',
            type: 'string',
            displayOptions: {
                show: {
                    useSystemCredentialsForRole: [false],
                },
            },
            default: '',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'Role ARN',
            name: 'roleArn',
            description: 'The ARN of the role to assume (e.g., arn:aws:iam::123456789012:role/MyRole)',
            type: 'string',
            required: true,
            default: '',
            placeholder: 'arn:aws:iam::123456789012:role/MyRole',
        },
        {
            displayName: 'External ID',
            name: 'externalId',
            description: "External ID for cross-account role assumption (should be required by your role's trust policy)",
            type: 'string',
            required: true,
            default: '',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'Role Session Name',
            name: 'roleSessionName',
            description: 'Name for the role session',
            type: 'string',
            required: true,
            default: 'n8n-session',
        },
        ...descriptions_1.awsCustomEndpoints,
    ];
    async authenticate(decryptedCredentials, requestOptions) {
        const credentials = decryptedCredentials;
        const service = requestOptions.qs?.service;
        const path = requestOptions.qs?.path ?? '';
        const method = requestOptions.method;
        let region = credentials.region;
        if (requestOptions.qs?._region) {
            region = requestOptions.qs._region;
            delete requestOptions.qs._region;
        }
        let finalCredentials = credentials;
        let securityHeaders;
        if (!credentials.roleArn || credentials.roleArn.trim() === '') {
            throw new n8n_workflow_1.ApplicationError('Role ARN is required when assuming a role.');
        }
        if (!credentials.externalId || credentials.externalId.trim() === '') {
            throw new n8n_workflow_1.ApplicationError('External ID is required when assuming a role.');
        }
        if (!credentials.roleSessionName || credentials.roleSessionName.trim() === '') {
            throw new n8n_workflow_1.ApplicationError('Role Session Name is required when assuming a role.');
        }
        try {
            securityHeaders = await (0, utils_1.assumeRole)(credentials, region);
            finalCredentials = { ...credentials, ...securityHeaders };
        }
        catch (error) {
            console.error('Failed to assume role:', error);
            throw new n8n_workflow_1.ApplicationError(`Failed to assume role: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        const { signOpts, url } = (0, utils_1.awsGetSignInOptionsAndUpdateRequest)(requestOptions, finalCredentials, path, method, service, region);
        return (0, utils_1.signOptions)(requestOptions, signOpts, securityHeaders, url, method);
    }
    test = utils_1.awsCredentialsTest;
}
exports.AwsAssumeRole = AwsAssumeRole;
//# sourceMappingURL=AwsAssumeRole.credentials.js.map
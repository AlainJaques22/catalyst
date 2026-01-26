"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = void 0;
class S3 {
    name = 's3';
    displayName = 'S3';
    documentationUrl = 's3';
    properties = [
        {
            displayName: 'S3 Endpoint',
            name: 'endpoint',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Region',
            name: 'region',
            type: 'string',
            default: 'us-east-1',
        },
        {
            displayName: 'Access Key ID',
            name: 'accessKeyId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Secret Access Key',
            name: 'secretAccessKey',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'Force Path Style',
            name: 'forcePathStyle',
            type: 'boolean',
            default: false,
        },
        {
            displayName: 'Ignore SSL Issues (Insecure)',
            name: 'ignoreSSLIssues',
            type: 'boolean',
            default: false,
            description: 'Whether to connect even if SSL certificate validation is not possible',
        },
    ];
}
exports.S3 = S3;
//# sourceMappingURL=S3.credentials.js.map
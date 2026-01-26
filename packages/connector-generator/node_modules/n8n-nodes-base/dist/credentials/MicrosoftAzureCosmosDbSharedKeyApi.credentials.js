"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftAzureCosmosDbSharedKeyApi = void 0;
const crypto_1 = require("crypto");
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../nodes/Microsoft/AzureCosmosDb/helpers/constants");
class MicrosoftAzureCosmosDbSharedKeyApi {
    name = 'microsoftAzureCosmosDbSharedKeyApi';
    displayName = 'Microsoft Azure Cosmos DB API';
    documentationUrl = 'azurecosmosdb';
    properties = [
        {
            displayName: 'Account',
            name: 'account',
            default: '',
            description: 'Account name',
            required: true,
            type: 'string',
        },
        {
            displayName: 'Key',
            name: 'key',
            default: '',
            description: 'Account key',
            required: true,
            type: 'string',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'Database',
            name: 'database',
            default: '',
            description: 'Database name',
            required: true,
            type: 'string',
        },
    ];
    async authenticate(credentials, requestOptions) {
        const date = new Date().toUTCString();
        requestOptions.headers ??= {};
        requestOptions.headers = {
            ...requestOptions.headers,
            'x-ms-date': date,
            'x-ms-version': constants_1.CURRENT_VERSION,
            'Cache-Control': 'no-cache',
        };
        // HttpRequest node uses IRequestOptions.uri
        const url = new URL(requestOptions.uri ?? requestOptions.baseURL + requestOptions.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const foundResource = constants_1.RESOURCE_TYPES.map((type) => ({
            type,
            index: pathSegments.lastIndexOf(type),
        }))
            .filter(({ index }) => index !== -1)
            .sort((a, b) => b.index - a.index)
            .shift();
        if (!foundResource) {
            throw new n8n_workflow_1.OperationalError('Unable to determine the resource type from the URL');
        }
        const { type, index } = foundResource;
        const resourceId = pathSegments[index + 1] !== undefined
            ? `${pathSegments.slice(0, index).join('/')}/${type}/${pathSegments[index + 1]}`
            : pathSegments.slice(0, index).join('/');
        const key = Buffer.from(credentials.key, 'base64');
        const payload = `${(requestOptions.method ?? 'GET').toLowerCase()}\n${type.toLowerCase()}\n${resourceId}\n${date.toLowerCase()}\n\n`;
        const hmacSha256 = (0, crypto_1.createHmac)('sha256', key);
        const signature = hmacSha256.update(payload, 'utf8').digest('base64');
        requestOptions.headers[constants_1.HeaderConstants.AUTHORIZATION] = encodeURIComponent(`type=master&ver=1.0&sig=${signature}`);
        return requestOptions;
    }
    test = {
        request: {
            baseURL: '=https://{{ $credentials.account }}.documents.azure.com/dbs/{{ $credentials.database }}',
            url: '/colls',
        },
    };
}
exports.MicrosoftAzureCosmosDbSharedKeyApi = MicrosoftAzureCosmosDbSharedKeyApi;
//# sourceMappingURL=MicrosoftAzureCosmosDbSharedKeyApi.credentials.js.map
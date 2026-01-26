"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStorageSharedKeyApi = void 0;
const node_crypto_1 = require("node:crypto");
const GenericFunctions_1 = require("../nodes/Microsoft/Storage/GenericFunctions");
class AzureStorageSharedKeyApi {
    name = 'azureStorageSharedKeyApi';
    displayName = 'Azure Storage Shared Key API';
    documentationUrl = 'azurestorage';
    properties = [
        {
            displayName: 'Account',
            name: 'account',
            description: 'Account name',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Key',
            name: 'key',
            description: 'Account key',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'hidden',
            default: '=https://{{ $self["account"] }}.blob.core.windows.net',
        },
    ];
    async authenticate(credentials, requestOptions) {
        if (requestOptions.qs) {
            for (const [key, value] of Object.entries(requestOptions.qs)) {
                if (value === undefined) {
                    delete requestOptions.qs[key];
                }
            }
        }
        if (requestOptions.headers) {
            for (const [key, value] of Object.entries(requestOptions.headers)) {
                if (value === undefined) {
                    delete requestOptions.headers[key];
                }
            }
        }
        requestOptions.method ??= 'GET';
        requestOptions.headers ??= {};
        requestOptions.headers[GenericFunctions_1.HeaderConstants.X_MS_VERSION] ??= GenericFunctions_1.XMsVersion;
        requestOptions.headers[GenericFunctions_1.HeaderConstants.X_MS_DATE] ??= new Date().toUTCString();
        const stringToSign = [
            requestOptions.method.toUpperCase(),
            requestOptions.headers[GenericFunctions_1.HeaderConstants.CONTENT_LANGUAGE] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.CONTENT_ENCODING] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.CONTENT_LENGTH] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.CONTENT_MD5] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.CONTENT_TYPE] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.DATE] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.IF_MODIFIED_SINCE] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.IF_MATCH] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.IF_NONE_MATCH] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.IF_UNMODIFIED_SINCE] ?? '',
            requestOptions.headers[GenericFunctions_1.HeaderConstants.RANGE] ?? '',
            (0, GenericFunctions_1.getCanonicalizedHeadersString)(requestOptions) +
                (0, GenericFunctions_1.getCanonicalizedResourceString)(requestOptions, credentials),
        ].join('\n');
        const signature = (0, node_crypto_1.createHmac)('sha256', Buffer.from(credentials.key, 'base64'))
            .update(stringToSign, 'utf8')
            .digest('base64');
        requestOptions.headers[GenericFunctions_1.HeaderConstants.AUTHORIZATION] =
            `SharedKey ${credentials.account}:${signature}`;
        return requestOptions;
    }
    test = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/',
            headers: {
                'x-ms-date': '={{ new Date().toUTCString() }}',
                'x-ms-version': '2021-12-02',
            },
            qs: {
                comp: 'list',
            },
        },
    };
}
exports.AzureStorageSharedKeyApi = AzureStorageSharedKeyApi;
//# sourceMappingURL=AzureStorageSharedKeyApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryIoServerApi = void 0;
class SentryIoServerApi {
    name = 'sentryIoServerApi';
    displayName = 'Sentry.io Server API';
    documentationUrl = 'sentryio';
    properties = [
        {
            displayName: 'Token',
            name: 'token',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://example.com',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.token}}',
            },
        },
    };
    test = {
        request: {
            method: 'GET',
            baseURL: '={{$credentials.url}}',
            url: 'api/0/organizations/',
        },
    };
}
exports.SentryIoServerApi = SentryIoServerApi;
//# sourceMappingURL=SentryIoServerApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryIoApi = void 0;
class SentryIoApi {
    name = 'sentryIoApi';
    displayName = 'Sentry.io API';
    documentationUrl = 'sentryio';
    properties = [
        {
            displayName: 'Token',
            name: 'token',
            type: 'string',
            typeOptions: { password: true },
            default: '',
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
            baseURL: 'https://sentry.io',
            url: '/api/0/organizations/',
        },
    };
}
exports.SentryIoApi = SentryIoApi;
//# sourceMappingURL=SentryIoApi.credentials.js.map
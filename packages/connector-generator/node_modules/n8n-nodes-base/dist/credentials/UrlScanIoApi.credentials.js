"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlScanIoApi = void 0;
class UrlScanIoApi {
    name = 'urlScanIoApi';
    displayName = 'urlscan.io API';
    documentationUrl = 'urlscanio';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                'API-KEY': '={{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://urlscan.io',
            url: '/user/quotas',
        },
    };
}
exports.UrlScanIoApi = UrlScanIoApi;
//# sourceMappingURL=UrlScanIoApi.credentials.js.map
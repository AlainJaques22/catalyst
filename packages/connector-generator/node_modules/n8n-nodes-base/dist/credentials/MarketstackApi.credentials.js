"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketstackApi = void 0;
class MarketstackApi {
    name = 'marketstackApi';
    displayName = 'Marketstack API';
    documentationUrl = 'marketstack';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Use HTTPS',
            name: 'useHttps',
            type: 'boolean',
            default: false,
            description: 'Whether to use HTTPS (paid plans only)',
        },
    ];
}
exports.MarketstackApi = MarketstackApi;
//# sourceMappingURL=MarketstackApi.credentials.js.map
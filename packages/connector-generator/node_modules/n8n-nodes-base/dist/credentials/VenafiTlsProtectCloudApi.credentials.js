"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenafiTlsProtectCloudApi = void 0;
class VenafiTlsProtectCloudApi {
    name = 'venafiTlsProtectCloudApi';
    displayName = 'Venafi TLS Protect Cloud';
    documentationUrl = 'venafitlsprotectcloud';
    properties = [
        {
            displayName: 'Region',
            name: 'region',
            type: 'options',
            options: [
                {
                    name: 'US',
                    value: 'cloud',
                },
                {
                    name: 'EU',
                    value: 'eu',
                },
            ],
            default: 'cloud',
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                'tppl-api-key': '={{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '=https://api.venafi.{{$credentials.region ?? "cloud"}}',
            url: '/v1/preferences',
        },
    };
}
exports.VenafiTlsProtectCloudApi = VenafiTlsProtectCloudApi;
//# sourceMappingURL=VenafiTlsProtectCloudApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NocoDbApiToken = void 0;
class NocoDbApiToken {
    name = 'nocoDbApiToken';
    displayName = 'NocoDB API Token';
    documentationUrl = 'nocodb';
    properties = [
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: '',
            placeholder: 'http(s)://localhost:8080',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                'xc-token': '={{$credentials.apiToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{ $credentials.host }}',
            url: '/api/v1/auth/user/me',
        },
    };
}
exports.NocoDbApiToken = NocoDbApiToken;
//# sourceMappingURL=NocoDbApiToken.credentials.js.map
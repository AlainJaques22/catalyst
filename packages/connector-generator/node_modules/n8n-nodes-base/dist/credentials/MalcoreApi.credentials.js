"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MalcoreApi = void 0;
class MalcoreApi {
    name = 'malcoreApi';
    displayName = 'MalcoreAPI';
    documentationUrl = 'malcore';
    icon = { light: 'file:icons/Malcore.png', dark: 'file:icons/Malcore.png' };
    httpRequestNode = {
        name: 'Malcore',
        docsUrl: 'https://malcore.readme.io/reference/upload',
        apiBaseUrlPlaceholder: 'https://api.malcore.io/api/urlcheck',
    };
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            required: true,
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                apiKey: '={{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.malcore.io/api',
            url: '/urlcheck',
            method: 'POST',
            body: { url: 'google.com' },
        },
    };
}
exports.MalcoreApi = MalcoreApi;
//# sourceMappingURL=MalcoreApi.credentials.js.map
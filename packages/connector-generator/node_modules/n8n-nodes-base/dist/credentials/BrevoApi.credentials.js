"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrevoApi = void 0;
class BrevoApi {
    // keep sendinblue name for backward compatibility
    name = 'sendInBlueApi';
    displayName = 'Brevo';
    documentationUrl = 'brevo';
    properties = [
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
                'api-key': '={{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.brevo.com/v3',
            url: '/account',
        },
    };
}
exports.BrevoApi = BrevoApi;
//# sourceMappingURL=BrevoApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerLiteApi = void 0;
class MailerLiteApi {
    name = 'mailerLiteApi';
    displayName = 'Mailer Lite API';
    documentationUrl = 'mailerlite';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Classic API',
            name: 'classicApi',
            type: 'boolean',
            default: true,
            description: 'If the Classic API should be used, If this is your first time using this node this should be false.',
        },
    ];
    async authenticate(credentials, requestOptions) {
        if (credentials.classicApi === true) {
            requestOptions.headers = {
                'X-MailerLite-ApiKey': credentials.apiKey,
            };
        }
        else {
            requestOptions.headers = {
                Authorization: `Bearer ${credentials.apiKey}`,
            };
        }
        return requestOptions;
    }
    test = {
        request: {
            baseURL: '={{$credentials.classicApi ? "https://api.mailerlite.com/api/v2" : "https://connect.mailerlite.com/api"}}',
            url: '/groups',
        },
    };
}
exports.MailerLiteApi = MailerLiteApi;
//# sourceMappingURL=MailerLiteApi.credentials.js.map
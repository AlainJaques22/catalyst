"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridApi = void 0;
class SendGridApi {
    name = 'sendGridApi';
    displayName = 'SendGrid API';
    documentationUrl = 'sendgrid';
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
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.sendgrid.com/v3',
            url: '/scopes',
        },
    };
}
exports.SendGridApi = SendGridApi;
//# sourceMappingURL=SendGridApi.credentials.js.map
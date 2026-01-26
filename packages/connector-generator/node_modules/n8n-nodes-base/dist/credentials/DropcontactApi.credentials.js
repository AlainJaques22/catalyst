"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropcontactApi = void 0;
class DropcontactApi {
    name = 'dropcontactApi';
    displayName = 'Dropcontact API';
    documentationUrl = 'dropcontact';
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
                'user-agent': 'n8n',
                'X-Access-Token': '={{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.dropcontact.io',
            url: '/batch',
            method: 'POST',
            body: {
                data: [{ email: '' }],
            },
        },
    };
}
exports.DropcontactApi = DropcontactApi;
//# sourceMappingURL=DropcontactApi.credentials.js.map
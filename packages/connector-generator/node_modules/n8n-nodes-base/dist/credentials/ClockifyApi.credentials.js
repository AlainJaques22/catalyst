"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockifyApi = void 0;
class ClockifyApi {
    name = 'clockifyApi';
    displayName = 'Clockify API';
    documentationUrl = 'clockify';
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
                'X-Api-Key': '={{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.clockify.me/api/v1',
            url: '/workspaces',
        },
    };
}
exports.ClockifyApi = ClockifyApi;
//# sourceMappingURL=ClockifyApi.credentials.js.map
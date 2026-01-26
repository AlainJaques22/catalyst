"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscourseApi = void 0;
class DiscourseApi {
    name = 'discourseApi';
    displayName = 'Discourse API';
    documentationUrl = 'discourse';
    properties = [
        {
            displayName: 'URL',
            name: 'url',
            required: true,
            type: 'string',
            default: '',
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            required: true,
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Username',
            name: 'username',
            required: true,
            type: 'string',
            default: '',
        },
    ];
    async authenticate(credentials, requestOptions) {
        requestOptions.headers = {
            'Api-Key': credentials.apiKey,
            'Api-Username': credentials.username,
        };
        if (requestOptions.method === 'GET') {
            delete requestOptions.body;
        }
        return requestOptions;
    }
    test = {
        request: {
            baseURL: '={{$credentials.url}}',
            url: '/groups.json',
            method: 'GET',
        },
    };
}
exports.DiscourseApi = DiscourseApi;
//# sourceMappingURL=DiscourseApi.credentials.js.map
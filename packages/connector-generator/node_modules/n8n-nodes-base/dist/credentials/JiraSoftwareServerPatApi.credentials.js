"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraSoftwareServerPatApi = void 0;
class JiraSoftwareServerPatApi {
    name = 'jiraSoftwareServerPatApi';
    displayName = 'Jira SW Server (PAT) API';
    documentationUrl = 'jira';
    properties = [
        {
            displayName: 'Personal Access Token',
            name: 'personalAccessToken',
            typeOptions: { password: true },
            type: 'string',
            default: '',
        },
        {
            displayName: 'Domain',
            name: 'domain',
            type: 'string',
            default: '',
            placeholder: 'https://example.com',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.personalAccessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{$credentials?.domain}}',
            url: '/rest/api/2/myself',
        },
    };
}
exports.JiraSoftwareServerPatApi = JiraSoftwareServerPatApi;
//# sourceMappingURL=JiraSoftwareServerPatApi.credentials.js.map
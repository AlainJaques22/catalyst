"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraSoftwareServerApi = void 0;
class JiraSoftwareServerApi {
    name = 'jiraSoftwareServerApi';
    displayName = 'Jira SW Server API';
    documentationUrl = 'jira';
    properties = [
        {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            placeholder: 'name@email.com',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            typeOptions: {
                password: true,
            },
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
            auth: {
                username: '={{$credentials.email}}',
                password: '={{$credentials.password}}',
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
exports.JiraSoftwareServerApi = JiraSoftwareServerApi;
//# sourceMappingURL=JiraSoftwareServerApi.credentials.js.map
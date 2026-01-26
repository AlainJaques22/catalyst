"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RundeckApi = void 0;
class RundeckApi {
    name = 'rundeckApi';
    displayName = 'Rundeck API';
    documentationUrl = 'rundeck';
    properties = [
        {
            displayName: 'Url',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'http://127.0.0.1:4440',
        },
        {
            displayName: 'Token',
            name: 'token',
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
                'X-Rundeck-Auth-Token': '={{$credentials?.token}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{$credentials.url}}',
            url: '/api/14/system/info',
            method: 'GET',
        },
    };
}
exports.RundeckApi = RundeckApi;
//# sourceMappingURL=RundeckApi.credentials.js.map
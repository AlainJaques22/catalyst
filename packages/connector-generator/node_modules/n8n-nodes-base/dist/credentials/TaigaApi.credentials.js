"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaigaApi = void 0;
class TaigaApi {
    name = 'taigaApi';
    displayName = 'Taiga API';
    documentationUrl = 'taiga';
    properties = [
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Environment',
            name: 'environment',
            type: 'options',
            default: 'cloud',
            options: [
                {
                    name: 'Cloud',
                    value: 'cloud',
                },
                {
                    name: 'Self-Hosted',
                    value: 'selfHosted',
                },
            ],
        },
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://taiga.yourdomain.com',
            displayOptions: {
                show: {
                    environment: ['selfHosted'],
                },
            },
        },
    ];
}
exports.TaigaApi = TaigaApi;
//# sourceMappingURL=TaigaApi.credentials.js.map
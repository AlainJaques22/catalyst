"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitwardenApi = void 0;
// https://bitwarden.com/help/article/public-api/#authentication
class BitwardenApi {
    name = 'bitwardenApi';
    displayName = 'Bitwarden API';
    documentationUrl = 'bitwarden';
    properties = [
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Client Secret',
            name: 'clientSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Environment',
            name: 'environment',
            type: 'options',
            default: 'cloudHosted',
            options: [
                {
                    name: 'Cloud-Hosted',
                    value: 'cloudHosted',
                },
                {
                    name: 'Self-Hosted',
                    value: 'selfHosted',
                },
            ],
        },
        {
            displayName: 'Self-Hosted Domain',
            name: 'domain',
            type: 'string',
            default: '',
            placeholder: 'https://www.mydomain.com',
            displayOptions: {
                show: {
                    environment: ['selfHosted'],
                },
            },
        },
    ];
}
exports.BitwardenApi = BitwardenApi;
//# sourceMappingURL=BitwardenApi.credentials.js.map
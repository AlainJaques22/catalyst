"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmApi = void 0;
class NpmApi {
    name = 'npmApi';
    displayName = 'Npm API';
    documentationUrl = 'npm';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Registry Url',
            name: 'registryUrl',
            type: 'string',
            default: 'https://registry.npmjs.org',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{$credentials.registryUrl}}',
            url: '/-/whoami',
        },
    };
}
exports.NpmApi = NpmApi;
//# sourceMappingURL=NpmApi.credentials.js.map
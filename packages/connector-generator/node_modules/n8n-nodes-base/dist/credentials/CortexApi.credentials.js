"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CortexApi = void 0;
class CortexApi {
    name = 'cortexApi';
    displayName = 'Cortex API';
    documentationUrl = 'cortex';
    properties = [
        {
            displayName: 'API Key',
            name: 'cortexApiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Cortex Instance',
            name: 'host',
            type: 'string',
            description: 'The URL of the Cortex instance',
            default: '',
            placeholder: 'https://localhost:9001',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.cortexApiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{$credentials.host}}',
            url: '/api/analyzer',
        },
    };
}
exports.CortexApi = CortexApi;
//# sourceMappingURL=CortexApi.credentials.js.map
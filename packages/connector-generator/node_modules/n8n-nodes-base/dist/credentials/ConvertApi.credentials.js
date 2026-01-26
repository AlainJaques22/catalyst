"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertApi = void 0;
class ConvertApi {
    name = 'convertApi';
    displayName = 'ConvertAPI';
    documentationUrl = 'convertapi';
    icon = 'file:icons/ConvertApi.png';
    httpRequestNode = {
        name: 'ConvertAPI',
        docsUrl: 'https://docs.convertapi.com/docs/getting-started',
        apiBaseUrl: 'https://v2.convertapi.com/',
    };
    properties = [
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://v2.convertapi.com',
            url: '/convert/docx/to/pdf',
            ignoreHttpStatusErrors: true,
        },
        rules: [
            {
                type: 'responseSuccessBody',
                properties: {
                    key: 'Code',
                    value: 4013,
                    message: 'API Token or Secret is invalid.',
                },
            },
        ],
    };
}
exports.ConvertApi = ConvertApi;
//# sourceMappingURL=ConvertApi.credentials.js.map
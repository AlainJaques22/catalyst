"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeformApi = void 0;
class TypeformApi {
    name = 'typeformApi';
    displayName = 'Typeform API';
    documentationUrl = 'typeform';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=bearer {{$credentials.accessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.typeform.com',
            url: '/forms',
        },
    };
}
exports.TypeformApi = TypeformApi;
//# sourceMappingURL=TypeformApi.credentials.js.map
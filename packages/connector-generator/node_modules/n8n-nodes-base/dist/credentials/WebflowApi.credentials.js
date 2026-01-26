"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebflowApi = void 0;
class WebflowApi {
    name = 'webflowApi';
    displayName = 'Webflow API';
    documentationUrl = 'webflow';
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
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.webflow.com',
            url: '/sites',
        },
    };
}
exports.WebflowApi = WebflowApi;
//# sourceMappingURL=WebflowApi.credentials.js.map
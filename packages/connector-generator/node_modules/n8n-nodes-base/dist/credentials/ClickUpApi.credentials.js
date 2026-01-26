"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickUpApi = void 0;
class ClickUpApi {
    name = 'clickUpApi';
    displayName = 'ClickUp API';
    documentationUrl = 'clickup';
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
                Authorization: '={{$credentials.accessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.clickup.com/api/v2',
            url: '/team',
        },
    };
}
exports.ClickUpApi = ClickUpApi;
//# sourceMappingURL=ClickUpApi.credentials.js.map
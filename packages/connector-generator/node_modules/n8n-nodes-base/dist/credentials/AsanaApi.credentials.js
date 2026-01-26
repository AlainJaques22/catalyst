"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsanaApi = void 0;
class AsanaApi {
    name = 'asanaApi';
    displayName = 'Asana API';
    documentationUrl = 'asana';
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
}
exports.AsanaApi = AsanaApi;
//# sourceMappingURL=AsanaApi.credentials.js.map
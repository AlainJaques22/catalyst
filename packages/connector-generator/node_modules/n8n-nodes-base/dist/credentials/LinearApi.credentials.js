"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearApi = void 0;
class LinearApi {
    name = 'linearApi';
    displayName = 'Linear API';
    documentationUrl = 'linear';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{$credentials.apiKey}}',
            },
        },
    };
}
exports.LinearApi = LinearApi;
//# sourceMappingURL=LinearApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordedFutureApi = void 0;
class RecordedFutureApi {
    name = 'recordedFutureApi';
    displayName = 'Recorded Future API';
    documentationUrl = 'recordedfuture';
    icon = {
        light: 'file:icons/RecordedFuture.svg',
        dark: 'file:icons/RecordedFuture.dark.svg',
    };
    httpRequestNode = {
        name: 'Recorded Future',
        docsUrl: 'https://api.recordedfuture.com',
        apiBaseUrl: 'https://api.recordedfuture.com/v2/',
    };
    properties = [
        {
            displayName: 'Access Token',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                'X-RFToken': '={{$credentials.accessToken}}',
            },
        },
    };
}
exports.RecordedFutureApi = RecordedFutureApi;
//# sourceMappingURL=RecordedFutureApi.credentials.js.map
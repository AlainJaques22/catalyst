"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodaApi = void 0;
class CodaApi {
    name = 'codaApi';
    displayName = 'Coda API';
    documentationUrl = 'coda';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    test = {
        request: {
            baseURL: 'https://coda.io/apis/v1/whoami',
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };
}
exports.CodaApi = CodaApi;
//# sourceMappingURL=CodaApi.credentials.js.map
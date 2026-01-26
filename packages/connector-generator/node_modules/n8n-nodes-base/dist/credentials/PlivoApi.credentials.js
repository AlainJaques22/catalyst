"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlivoApi = void 0;
class PlivoApi {
    name = 'plivoApi';
    displayName = 'Plivo API';
    documentationUrl = 'plivo';
    properties = [
        {
            displayName: 'Auth ID',
            name: 'authId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Auth Token',
            name: 'authToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.PlivoApi = PlivoApi;
//# sourceMappingURL=PlivoApi.credentials.js.map
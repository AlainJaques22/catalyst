"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpleadApi = void 0;
class UpleadApi {
    name = 'upleadApi';
    displayName = 'Uplead API';
    documentationUrl = 'uplead';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.UpleadApi = UpleadApi;
//# sourceMappingURL=UpleadApi.credentials.js.map
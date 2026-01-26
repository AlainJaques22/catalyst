"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmeliaApi = void 0;
class EmeliaApi {
    name = 'emeliaApi';
    displayName = 'Emelia API';
    documentationUrl = 'emelia';
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
exports.EmeliaApi = EmeliaApi;
//# sourceMappingURL=EmeliaApi.credentials.js.map
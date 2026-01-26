"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DhlApi = void 0;
class DhlApi {
    name = 'dhlApi';
    displayName = 'DHL API';
    documentationUrl = 'dhl';
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
exports.DhlApi = DhlApi;
//# sourceMappingURL=DhlApi.credentials.js.map
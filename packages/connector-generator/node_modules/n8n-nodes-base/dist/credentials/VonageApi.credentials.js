"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VonageApi = void 0;
class VonageApi {
    name = 'vonageApi';
    displayName = 'Vonage API';
    documentationUrl = 'vonage';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'API Secret',
            name: 'apiSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.VonageApi = VonageApi;
//# sourceMappingURL=VonageApi.credentials.js.map
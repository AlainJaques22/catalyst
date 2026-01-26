"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemioApi = void 0;
class DemioApi {
    name = 'demioApi';
    displayName = 'Demio API';
    documentationUrl = 'demio';
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
exports.DemioApi = DemioApi;
//# sourceMappingURL=DemioApi.credentials.js.map
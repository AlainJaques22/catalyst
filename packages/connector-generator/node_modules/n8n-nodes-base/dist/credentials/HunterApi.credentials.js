"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HunterApi = void 0;
class HunterApi {
    name = 'hunterApi';
    displayName = 'Hunter API';
    documentationUrl = 'hunter';
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
exports.HunterApi = HunterApi;
//# sourceMappingURL=HunterApi.credentials.js.map
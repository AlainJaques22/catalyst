"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffinityApi = void 0;
class AffinityApi {
    name = 'affinityApi';
    displayName = 'Affinity API';
    documentationUrl = 'affinity';
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
exports.AffinityApi = AffinityApi;
//# sourceMappingURL=AffinityApi.credentials.js.map
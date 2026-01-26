"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeekalinkApi = void 0;
class PeekalinkApi {
    name = 'peekalinkApi';
    displayName = 'Peekalink API';
    documentationUrl = 'peekalink';
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
exports.PeekalinkApi = PeekalinkApi;
//# sourceMappingURL=PeekalinkApi.credentials.js.map
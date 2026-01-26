"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackbyApi = void 0;
class StackbyApi {
    name = 'stackbyApi';
    displayName = 'Stackby API';
    documentationUrl = 'stackby';
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
exports.StackbyApi = StackbyApi;
//# sourceMappingURL=StackbyApi.credentials.js.map
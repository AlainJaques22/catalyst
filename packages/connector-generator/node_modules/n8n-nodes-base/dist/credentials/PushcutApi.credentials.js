"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushcutApi = void 0;
class PushcutApi {
    name = 'pushcutApi';
    displayName = 'Pushcut API';
    documentationUrl = 'pushcut';
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
exports.PushcutApi = PushcutApi;
//# sourceMappingURL=PushcutApi.credentials.js.map
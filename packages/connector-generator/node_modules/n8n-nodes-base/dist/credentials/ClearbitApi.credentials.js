"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearbitApi = void 0;
class ClearbitApi {
    name = 'clearbitApi';
    displayName = 'Clearbit API';
    documentationUrl = 'clearbit';
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
exports.ClearbitApi = ClearbitApi;
//# sourceMappingURL=ClearbitApi.credentials.js.map
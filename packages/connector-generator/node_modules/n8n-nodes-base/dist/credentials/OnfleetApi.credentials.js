"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnfleetApi = void 0;
class OnfleetApi {
    name = 'onfleetApi';
    displayName = 'Onfleet API';
    documentationUrl = 'onfleet';
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
exports.OnfleetApi = OnfleetApi;
//# sourceMappingURL=OnfleetApi.credentials.js.map
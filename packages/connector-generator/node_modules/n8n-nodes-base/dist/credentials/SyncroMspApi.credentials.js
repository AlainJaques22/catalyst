"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncroMspApi = void 0;
class SyncroMspApi {
    name = 'syncroMspApi';
    displayName = 'SyncroMSP API';
    documentationUrl = 'syncromsp';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Subdomain',
            name: 'subdomain',
            type: 'string',
            default: '',
        },
    ];
}
exports.SyncroMspApi = SyncroMspApi;
//# sourceMappingURL=SyncroMspApi.credentials.js.map
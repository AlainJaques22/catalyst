"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeroApi = void 0;
class VeroApi {
    name = 'veroApi';
    displayName = 'Vero API';
    documentationUrl = 'vero';
    properties = [
        {
            displayName: 'Auth Token',
            name: 'authToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.VeroApi = VeroApi;
//# sourceMappingURL=VeroApi.credentials.js.map
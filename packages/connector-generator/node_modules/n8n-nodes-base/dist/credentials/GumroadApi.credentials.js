"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GumroadApi = void 0;
class GumroadApi {
    name = 'gumroadApi';
    displayName = 'Gumroad API';
    documentationUrl = 'gumroad';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.GumroadApi = GumroadApi;
//# sourceMappingURL=GumroadApi.credentials.js.map
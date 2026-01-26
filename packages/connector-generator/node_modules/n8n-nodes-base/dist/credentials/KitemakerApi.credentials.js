"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitemakerApi = void 0;
class KitemakerApi {
    name = 'kitemakerApi';
    displayName = 'Kitemaker API';
    documentationUrl = 'kitemaker';
    properties = [
        {
            displayName: 'Personal Access Token',
            name: 'personalAccessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.KitemakerApi = KitemakerApi;
//# sourceMappingURL=KitemakerApi.credentials.js.map
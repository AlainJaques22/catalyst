"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneSimpleApi = void 0;
class OneSimpleApi {
    name = 'oneSimpleApi';
    displayName = 'One Simple API';
    documentationUrl = 'onesimpleapi';
    properties = [
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.OneSimpleApi = OneSimpleApi;
//# sourceMappingURL=OneSimpleApi.credentials.js.map
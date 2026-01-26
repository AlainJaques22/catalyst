"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravisCiApi = void 0;
class TravisCiApi {
    name = 'travisCiApi';
    displayName = 'Travis API';
    documentationUrl = 'travisci';
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
exports.TravisCiApi = TravisCiApi;
//# sourceMappingURL=TravisCiApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerbearApi = void 0;
class BannerbearApi {
    name = 'bannerbearApi';
    displayName = 'Bannerbear API';
    documentationUrl = 'bannerbear';
    properties = [
        {
            displayName: 'Project API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.BannerbearApi = BannerbearApi;
//# sourceMappingURL=BannerbearApi.credentials.js.map
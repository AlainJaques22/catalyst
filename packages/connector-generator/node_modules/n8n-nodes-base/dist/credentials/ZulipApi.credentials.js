"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZulipApi = void 0;
class ZulipApi {
    name = 'zulipApi';
    displayName = 'Zulip API';
    documentationUrl = 'zulip';
    properties = [
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://yourZulipDomain.zulipchat.com',
        },
        {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            placeholder: 'name@email.com',
            default: '',
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.ZulipApi = ZulipApi;
//# sourceMappingURL=ZulipApi.credentials.js.map
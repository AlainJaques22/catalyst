"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgileCrmApi = void 0;
class AgileCrmApi {
    name = 'agileCrmApi';
    displayName = 'AgileCRM API';
    documentationUrl = 'agilecrm';
    properties = [
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
        {
            displayName: 'Subdomain',
            name: 'subdomain',
            type: 'string',
            default: '',
            placeholder: 'example',
            description: 'If the domain is https://example.agilecrm.com "example" would have to be entered',
        },
    ];
}
exports.AgileCrmApi = AgileCrmApi;
//# sourceMappingURL=AgileCrmApi.credentials.js.map
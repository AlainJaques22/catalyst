"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandrillApi = void 0;
class MandrillApi {
    name = 'mandrillApi';
    displayName = 'Mandrill API';
    documentationUrl = 'mandrill';
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
exports.MandrillApi = MandrillApi;
//# sourceMappingURL=MandrillApi.credentials.js.map
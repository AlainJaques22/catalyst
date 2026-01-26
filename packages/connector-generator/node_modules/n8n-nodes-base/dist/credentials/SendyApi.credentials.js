"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendyApi = void 0;
class SendyApi {
    name = 'sendyApi';
    displayName = 'Sendy API';
    documentationUrl = 'sendy';
    properties = [
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://yourdomain.com',
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
exports.SendyApi = SendyApi;
//# sourceMappingURL=SendyApi.credentials.js.map
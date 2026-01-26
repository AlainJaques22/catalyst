"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailcheckApi = void 0;
class MailcheckApi {
    name = 'mailcheckApi';
    displayName = 'Mailcheck API';
    documentationUrl = 'mailcheck';
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
exports.MailcheckApi = MailcheckApi;
//# sourceMappingURL=MailcheckApi.credentials.js.map
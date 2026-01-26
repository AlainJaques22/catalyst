"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BambooHrApi = void 0;
class BambooHrApi {
    name = 'bambooHrApi';
    displayName = 'BambooHR API';
    documentationUrl = 'bamboohr';
    properties = [
        {
            displayName: 'Subdomain',
            name: 'subdomain',
            type: 'string',
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
exports.BambooHrApi = BambooHrApi;
//# sourceMappingURL=BambooHrApi.credentials.js.map
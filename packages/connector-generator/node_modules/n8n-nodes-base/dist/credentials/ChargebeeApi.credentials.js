"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargebeeApi = void 0;
class ChargebeeApi {
    name = 'chargebeeApi';
    displayName = 'Chargebee API';
    documentationUrl = 'chargebee';
    properties = [
        {
            displayName: 'Account Name',
            name: 'accountName',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Api Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.ChargebeeApi = ChargebeeApi;
//# sourceMappingURL=ChargebeeApi.credentials.js.map
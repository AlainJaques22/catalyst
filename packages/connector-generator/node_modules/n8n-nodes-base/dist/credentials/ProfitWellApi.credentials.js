"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitWellApi = void 0;
class ProfitWellApi {
    name = 'profitWellApi';
    displayName = 'ProfitWell API';
    documentationUrl = 'profitwell';
    properties = [
        {
            displayName: 'API Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Your Private Token',
        },
    ];
}
exports.ProfitWellApi = ProfitWellApi;
//# sourceMappingURL=ProfitWellApi.credentials.js.map
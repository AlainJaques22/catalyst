"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapfiliateApi = void 0;
class TapfiliateApi {
    name = 'tapfiliateApi';
    displayName = 'Tapfiliate API';
    documentationUrl = 'tapfiliate';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            required: true,
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.TapfiliateApi = TapfiliateApi;
//# sourceMappingURL=TapfiliateApi.credentials.js.map
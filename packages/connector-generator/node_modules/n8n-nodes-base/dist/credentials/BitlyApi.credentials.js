"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitlyApi = void 0;
class BitlyApi {
    name = 'bitlyApi';
    displayName = 'Bitly API';
    documentationUrl = 'bitly';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.BitlyApi = BitlyApi;
//# sourceMappingURL=BitlyApi.credentials.js.map
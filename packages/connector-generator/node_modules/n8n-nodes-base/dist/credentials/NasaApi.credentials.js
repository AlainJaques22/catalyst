"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NasaApi = void 0;
class NasaApi {
    name = 'nasaApi';
    displayName = 'NASA API';
    documentationUrl = 'nasa';
    properties = [
        {
            displayName: 'API Key',
            name: 'api_key',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.NasaApi = NasaApi;
//# sourceMappingURL=NasaApi.credentials.js.map
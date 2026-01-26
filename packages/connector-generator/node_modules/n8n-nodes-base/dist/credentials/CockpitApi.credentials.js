"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CockpitApi = void 0;
class CockpitApi {
    name = 'cockpitApi';
    displayName = 'Cockpit API';
    documentationUrl = 'cockpit';
    properties = [
        {
            displayName: 'Cockpit URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://example.com',
        },
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.CockpitApi = CockpitApi;
//# sourceMappingURL=CockpitApi.credentials.js.map
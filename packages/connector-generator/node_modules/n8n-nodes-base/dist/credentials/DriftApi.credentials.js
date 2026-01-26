"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriftApi = void 0;
class DriftApi {
    name = 'driftApi';
    displayName = 'Drift API';
    documentationUrl = 'drift';
    properties = [
        {
            displayName: 'Personal Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Visit your account details page, and grab the Access Token. See <a href="https://devdocs.drift.com/docs/quick-start">Drift auth</a>.',
        },
    ];
}
exports.DriftApi = DriftApi;
//# sourceMappingURL=DriftApi.credentials.js.map
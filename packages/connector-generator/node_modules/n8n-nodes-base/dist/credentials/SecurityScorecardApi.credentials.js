"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityScorecardApi = void 0;
class SecurityScorecardApi {
    name = 'securityScorecardApi';
    displayName = 'SecurityScorecard API';
    documentationUrl = 'securityscorecard';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
    ];
}
exports.SecurityScorecardApi = SecurityScorecardApi;
//# sourceMappingURL=SecurityScorecardApi.credentials.js.map
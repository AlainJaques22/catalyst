"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftGraphSecurityOAuth2Api = void 0;
class MicrosoftGraphSecurityOAuth2Api {
    name = 'microsoftGraphSecurityOAuth2Api';
    displayName = 'Microsoft Graph Security OAuth2 API';
    extends = ['microsoftOAuth2Api'];
    documentationUrl = 'microsoft';
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: 'SecurityEvents.ReadWrite.All offline_access',
        },
    ];
}
exports.MicrosoftGraphSecurityOAuth2Api = MicrosoftGraphSecurityOAuth2Api;
//# sourceMappingURL=MicrosoftGraphSecurityOAuth2Api.credentials.js.map
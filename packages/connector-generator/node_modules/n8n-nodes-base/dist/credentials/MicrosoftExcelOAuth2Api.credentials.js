"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftExcelOAuth2Api = void 0;
class MicrosoftExcelOAuth2Api {
    name = 'microsoftExcelOAuth2Api';
    extends = ['microsoftOAuth2Api'];
    displayName = 'Microsoft Excel OAuth2 API';
    documentationUrl = 'microsoft';
    properties = [
        //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: 'openid offline_access Files.ReadWrite',
        },
    ];
}
exports.MicrosoftExcelOAuth2Api = MicrosoftExcelOAuth2Api;
//# sourceMappingURL=MicrosoftExcelOAuth2Api.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftToDoOAuth2Api = void 0;
class MicrosoftToDoOAuth2Api {
    name = 'microsoftToDoOAuth2Api';
    extends = ['microsoftOAuth2Api'];
    displayName = 'Microsoft To Do OAuth2 API';
    documentationUrl = 'microsoft';
    properties = [
        //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: 'openid offline_access Tasks.ReadWrite',
        },
    ];
}
exports.MicrosoftToDoOAuth2Api = MicrosoftToDoOAuth2Api;
//# sourceMappingURL=MicrosoftToDoOAuth2Api.credentials.js.map
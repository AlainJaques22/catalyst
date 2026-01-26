"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTranslateOAuth2Api = void 0;
const scopes = ['https://www.googleapis.com/auth/cloud-translation'];
class GoogleTranslateOAuth2Api {
    name = 'googleTranslateOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Translate OAuth2 API';
    documentationUrl = 'google/oauth-single-service';
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
    ];
}
exports.GoogleTranslateOAuth2Api = GoogleTranslateOAuth2Api;
//# sourceMappingURL=GoogleTranslateOAuth2Api.credentials.js.map
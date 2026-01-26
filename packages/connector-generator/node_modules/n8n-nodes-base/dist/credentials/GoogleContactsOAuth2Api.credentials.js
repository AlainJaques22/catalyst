"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleContactsOAuth2Api = void 0;
const scopes = ['https://www.googleapis.com/auth/contacts'];
class GoogleContactsOAuth2Api {
    name = 'googleContactsOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Contacts OAuth2 API';
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
exports.GoogleContactsOAuth2Api = GoogleContactsOAuth2Api;
//# sourceMappingURL=GoogleContactsOAuth2Api.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePerspectiveOAuth2Api = void 0;
const scopes = ['https://www.googleapis.com/auth/userinfo.email'];
class GooglePerspectiveOAuth2Api {
    name = 'googlePerspectiveOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Perspective OAuth2 API';
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
exports.GooglePerspectiveOAuth2Api = GooglePerspectiveOAuth2Api;
//# sourceMappingURL=GooglePerspectiveOAuth2Api.credentials.js.map
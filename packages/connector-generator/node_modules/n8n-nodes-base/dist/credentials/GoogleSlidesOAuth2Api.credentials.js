"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSlidesOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/presentations',
];
class GoogleSlidesOAuth2Api {
    name = 'googleSlidesOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Slides OAuth2 API';
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
exports.GoogleSlidesOAuth2Api = GoogleSlidesOAuth2Api;
//# sourceMappingURL=GoogleSlidesOAuth2Api.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleBooksOAuth2Api = void 0;
const scopes = ['https://www.googleapis.com/auth/books'];
class GoogleBooksOAuth2Api {
    name = 'googleBooksOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Books OAuth2 API';
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
exports.GoogleBooksOAuth2Api = GoogleBooksOAuth2Api;
//# sourceMappingURL=GoogleBooksOAuth2Api.credentials.js.map
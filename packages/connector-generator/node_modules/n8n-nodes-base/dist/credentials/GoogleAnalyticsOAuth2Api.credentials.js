"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAnalyticsOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly',
];
class GoogleAnalyticsOAuth2Api {
    name = 'googleAnalyticsOAuth2';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Analytics OAuth2 API';
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
exports.GoogleAnalyticsOAuth2Api = GoogleAnalyticsOAuth2Api;
//# sourceMappingURL=GoogleAnalyticsOAuth2Api.credentials.js.map
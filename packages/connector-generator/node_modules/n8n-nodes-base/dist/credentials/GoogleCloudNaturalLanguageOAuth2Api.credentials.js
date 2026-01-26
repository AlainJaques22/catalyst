"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudNaturalLanguageOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/cloud-language',
    'https://www.googleapis.com/auth/cloud-platform',
];
class GoogleCloudNaturalLanguageOAuth2Api {
    name = 'googleCloudNaturalLanguageOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Cloud Natural Language OAuth2 API';
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
exports.GoogleCloudNaturalLanguageOAuth2Api = GoogleCloudNaturalLanguageOAuth2Api;
//# sourceMappingURL=GoogleCloudNaturalLanguageOAuth2Api.credentials.js.map
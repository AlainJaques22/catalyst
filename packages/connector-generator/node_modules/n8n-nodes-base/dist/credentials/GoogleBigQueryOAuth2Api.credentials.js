"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleBigQueryOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/bigquery',
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/drive',
];
class GoogleBigQueryOAuth2Api {
    name = 'googleBigQueryOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google BigQuery OAuth2 API';
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
exports.GoogleBigQueryOAuth2Api = GoogleBigQueryOAuth2Api;
//# sourceMappingURL=GoogleBigQueryOAuth2Api.credentials.js.map
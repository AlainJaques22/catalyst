"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDocsOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
];
class GoogleDocsOAuth2Api {
    name = 'googleDocsOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Docs OAuth2 API';
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
exports.GoogleDocsOAuth2Api = GoogleDocsOAuth2Api;
//# sourceMappingURL=GoogleDocsOAuth2Api.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriftOAuth2Api = void 0;
class DriftOAuth2Api {
    name = 'driftOAuth2Api';
    extends = ['oAuth2Api'];
    displayName = 'Drift OAuth2 API';
    documentationUrl = 'drift';
    properties = [
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'hidden',
            default: 'authorizationCode',
        },
        {
            displayName: 'Authorization URL',
            name: 'authUrl',
            type: 'hidden',
            default: 'https://dev.drift.com/authorize',
            required: true,
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://driftapi.com/oauth2/token',
            required: true,
        },
        {
            displayName: 'Auth URI Query Parameters',
            name: 'authQueryParameters',
            type: 'hidden',
            default: '',
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: '',
        },
        {
            displayName: 'Authentication',
            name: 'authentication',
            type: 'hidden',
            default: 'body',
        },
    ];
}
exports.DriftOAuth2Api = DriftOAuth2Api;
//# sourceMappingURL=DriftOAuth2Api.credentials.js.map
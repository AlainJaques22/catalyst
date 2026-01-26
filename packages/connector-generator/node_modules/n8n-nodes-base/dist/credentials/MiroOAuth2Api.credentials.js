"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiroOAuth2Api = void 0;
class MiroOAuth2Api {
    name = 'miroOAuth2Api';
    extends = ['oAuth2Api'];
    displayName = 'Miro OAuth2 API';
    documentationUrl = 'miro';
    icon = 'file:icons/Miro.svg';
    httpRequestNode = {
        name: 'Miro',
        docsUrl: 'https://developers.miro.com/reference/overview',
        apiBaseUrl: 'https://api.miro.com/v2/',
    };
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
            default: 'https://miro.com/oauth/authorize',
            required: true,
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://api.miro.com/v1/oauth/token',
            required: true,
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: '',
            required: true,
        },
        {
            displayName: 'Auth URI Query Parameters',
            name: 'authQueryParameters',
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
exports.MiroOAuth2Api = MiroOAuth2Api;
//# sourceMappingURL=MiroOAuth2Api.credentials.js.map
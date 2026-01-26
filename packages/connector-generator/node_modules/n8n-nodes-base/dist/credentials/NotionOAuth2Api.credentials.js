"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionOAuth2Api = void 0;
class NotionOAuth2Api {
    name = 'notionOAuth2Api';
    extends = ['oAuth2Api'];
    displayName = 'Notion OAuth2 API';
    documentationUrl = 'notion';
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
            default: 'https://api.notion.com/v1/oauth/authorize',
            required: true,
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://api.notion.com/v1/oauth/token',
            required: true,
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: '',
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
            default: 'header',
        },
    ];
}
exports.NotionOAuth2Api = NotionOAuth2Api;
//# sourceMappingURL=NotionOAuth2Api.credentials.js.map
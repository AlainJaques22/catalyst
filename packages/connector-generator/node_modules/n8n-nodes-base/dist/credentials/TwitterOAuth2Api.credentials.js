"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterOAuth2Api = void 0;
const scopes = [
    'tweet.read',
    'users.read',
    'tweet.write',
    'tweet.moderate.write',
    'users.read',
    'follows.read',
    'follows.write',
    'offline.access',
    'like.read',
    'like.write',
    'dm.write',
    'dm.read',
    'list.read',
    'list.write',
];
class TwitterOAuth2Api {
    name = 'twitterOAuth2Api';
    extends = ['oAuth2Api'];
    displayName = 'X OAuth2 API';
    documentationUrl = 'twitter';
    properties = [
        {
            displayName: 'Some operations require a Basic or Pro API. Refer to <a href="https://developer.x.com/en/docs/twitter-api" target="_blank">X API Docs</a> for more information.',
            name: 'apiPermissions',
            type: 'notice',
            default: '',
        },
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'hidden',
            default: 'pkce',
        },
        {
            displayName: 'Authorization URL',
            name: 'authUrl',
            type: 'hidden',
            default: 'https://twitter.com/i/oauth2/authorize',
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://api.twitter.com/2/oauth2/token',
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: `${scopes.join(' ')}`,
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
exports.TwitterOAuth2Api = TwitterOAuth2Api;
//# sourceMappingURL=TwitterOAuth2Api.credentials.js.map
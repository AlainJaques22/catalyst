"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeOAuth2Api = void 0;
//https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps#identify-access-scopes
const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtubepartner-channel-audit',
];
class YouTubeOAuth2Api {
    name = 'youTubeOAuth2Api';
    icon = 'node:n8n-nodes-base.youTube';
    extends = ['googleOAuth2Api'];
    displayName = 'YouTube OAuth2 API';
    documentationUrl = 'google';
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
    ];
}
exports.YouTubeOAuth2Api = YouTubeOAuth2Api;
//# sourceMappingURL=YouTubeOAuth2Api.credentials.js.map
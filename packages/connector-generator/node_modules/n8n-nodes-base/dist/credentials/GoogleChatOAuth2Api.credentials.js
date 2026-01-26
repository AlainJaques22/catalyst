"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleChatOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/chat.spaces',
    'https://www.googleapis.com/auth/chat.messages',
    'https://www.googleapis.com/auth/chat.memberships',
];
class GoogleChatOAuth2Api {
    name = 'googleChatOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Chat OAuth2 API';
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
exports.GoogleChatOAuth2Api = GoogleChatOAuth2Api;
//# sourceMappingURL=GoogleChatOAuth2Api.credentials.js.map
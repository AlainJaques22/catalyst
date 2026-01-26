"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTasksOAuth2Api = void 0;
const scopes = ['https://www.googleapis.com/auth/tasks'];
class GoogleTasksOAuth2Api {
    name = 'googleTasksOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Tasks OAuth2 API';
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
exports.GoogleTasksOAuth2Api = GoogleTasksOAuth2Api;
//# sourceMappingURL=GoogleTasksOAuth2Api.credentials.js.map
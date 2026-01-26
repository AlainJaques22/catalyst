"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleBusinessProfileOAuth2Api = void 0;
const scopes = ['https://www.googleapis.com/auth/business.manage'];
class GoogleBusinessProfileOAuth2Api {
    name = 'googleBusinessProfileOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Business Profile OAuth2 API';
    documentationUrl = 'google/oauth-single-service';
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
        {
            displayName: 'Make sure that you have fulfilled the prerequisites and requested access to Google Business Profile API. <a href="https://developers.google.com/my-business/content/prereqs" target="_blank">More info</a>. Also, make sure that you have enabled the following APIs & Services in the Google Cloud Console: Google My Business API, Google My Business Management API. <a href="https://docs.n8n.io/integrations/builtin/credentials/google/oauth-generic/#scopes" target="_blank">More info</a>.',
            name: 'notice',
            type: 'notice',
            default: '',
        },
    ];
}
exports.GoogleBusinessProfileOAuth2Api = GoogleBusinessProfileOAuth2Api;
//# sourceMappingURL=GoogleBusinessProfileOAuth2Api.credentials.js.map
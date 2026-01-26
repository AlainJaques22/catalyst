"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAdsOAuth2Api = void 0;
const scopes = ['https://www.googleapis.com/auth/adwords'];
class GoogleAdsOAuth2Api {
    name = 'googleAdsOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Ads OAuth2 API';
    documentationUrl = 'google/oauth-single-service';
    properties = [
        {
            displayName: 'Developer Token',
            name: 'developerToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
    ];
}
exports.GoogleAdsOAuth2Api = GoogleAdsOAuth2Api;
//# sourceMappingURL=GoogleAdsOAuth2Api.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookGraphApi = void 0;
class FacebookGraphApi {
    name = 'facebookGraphApi';
    displayName = 'Facebook Graph API';
    documentationUrl = 'facebookgraph';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            qs: {
                access_token: '={{$credentials.accessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://graph.facebook.com/v8.0',
            url: '/me',
        },
    };
}
exports.FacebookGraphApi = FacebookGraphApi;
//# sourceMappingURL=FacebookGraphApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookGraphAppApi = void 0;
class FacebookGraphAppApi {
    name = 'facebookGraphAppApi';
    displayName = 'Facebook Graph API (App)';
    documentationUrl = 'facebookapp';
    extends = ['facebookGraphApi'];
    properties = [
        {
            displayName: 'App Secret',
            name: 'appSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: '(Optional) When the app secret is set the node will verify this signature to validate the integrity and origin of the payload',
        },
    ];
}
exports.FacebookGraphAppApi = FacebookGraphAppApi;
//# sourceMappingURL=FacebookGraphAppApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBearerAuth = void 0;
// eslint-disable-next-line n8n-nodes-base/cred-class-name-unsuffixed
class HttpBearerAuth {
    // eslint-disable-next-line n8n-nodes-base/cred-class-field-name-unsuffixed
    name = 'httpBearerAuth';
    displayName = 'Bearer Auth';
    documentationUrl = 'httprequest';
    genericAuth = true;
    icon = 'node:n8n-nodes-base.httpRequest';
    properties = [
        {
            displayName: 'Bearer Token',
            name: 'token',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
        {
            displayName: 'This credential uses the "Authorization" header. To use a custom header, use a "Custom Auth" credential instead',
            name: 'useCustomAuth',
            type: 'notice',
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.token}}',
            },
        },
    };
}
exports.HttpBearerAuth = HttpBearerAuth;
//# sourceMappingURL=HttpBearerAuth.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpDigestAuth = void 0;
class HttpDigestAuth {
    name = 'httpDigestAuth';
    displayName = 'Digest Auth';
    documentationUrl = 'httprequest';
    genericAuth = true;
    icon = 'node:n8n-nodes-base.httpRequest';
    properties = [
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];
}
exports.HttpDigestAuth = HttpDigestAuth;
//# sourceMappingURL=HttpDigestAuth.credentials.js.map
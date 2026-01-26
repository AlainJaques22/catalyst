"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBasicAuth = void 0;
class HttpBasicAuth {
    name = 'httpBasicAuth';
    displayName = 'Basic Auth';
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
exports.HttpBasicAuth = HttpBasicAuth;
//# sourceMappingURL=HttpBasicAuth.credentials.js.map
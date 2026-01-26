"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpQueryAuth = void 0;
class HttpQueryAuth {
    name = 'httpQueryAuth';
    displayName = 'Query Auth';
    documentationUrl = 'httprequest';
    genericAuth = true;
    icon = 'node:n8n-nodes-base.httpRequest';
    properties = [
        {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];
}
exports.HttpQueryAuth = HttpQueryAuth;
//# sourceMappingURL=HttpQueryAuth.credentials.js.map
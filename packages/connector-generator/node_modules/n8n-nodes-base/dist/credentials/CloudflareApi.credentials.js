"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareApi = void 0;
class CloudflareApi {
    name = 'cloudflareApi';
    displayName = 'Cloudflare API';
    documentationUrl = 'cloudflare';
    properties = [
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.cloudflare.com/client/v4/user/tokens/verify',
        },
    };
}
exports.CloudflareApi = CloudflareApi;
//# sourceMappingURL=CloudflareApi.credentials.js.map
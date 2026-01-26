"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyApi = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class ShopifyApi {
    name = 'shopifyApi';
    displayName = 'Shopify API';
    documentationUrl = 'shopify';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            required: true,
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            required: true,
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Shop Subdomain',
            name: 'shopSubdomain',
            required: true,
            type: 'string',
            default: '',
            description: 'Only the subdomain without .myshopify.com',
        },
        {
            displayName: 'Shared Secret',
            name: 'sharedSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    async authenticate(credentials, requestOptions) {
        requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Basic ${Buffer.from(`${credentials.apiKey}:${credentials.password}`).toString(n8n_workflow_1.BINARY_ENCODING)}`,
        };
        return requestOptions;
    }
    test = {
        request: {
            baseURL: '=https://{{$credentials.shopSubdomain}}.myshopify.com/admin/api/2024-07',
            url: '/products.json',
        },
    };
}
exports.ShopifyApi = ShopifyApi;
//# sourceMappingURL=ShopifyApi.credentials.js.map
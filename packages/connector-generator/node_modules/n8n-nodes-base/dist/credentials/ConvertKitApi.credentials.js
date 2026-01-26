"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertKitApi = void 0;
const http_1 = require("./common/http");
class ConvertKitApi {
    name = 'convertKitApi';
    displayName = 'ConvertKit API';
    documentationUrl = 'convertkit';
    properties = [
        {
            displayName: 'API Secret',
            name: 'apiSecret',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
        },
    ];
    async authenticate(credentials, options) {
        const url = (0, http_1.getUrl)(options);
        const secret = {
            api_secret: credentials.apiSecret,
        };
        // it's a webhook so include the api secret on the body
        if (url?.includes('/automations/hooks')) {
            options.body = options.body || {};
            if (typeof options.body === 'object') {
                Object.assign(options.body, secret);
            }
        }
        else {
            options.qs = options.qs || {};
            if (typeof options.qs === 'object') {
                Object.assign(options.qs, secret);
            }
        }
        return options;
    }
    test = {
        request: {
            url: 'https://api.convertkit.com/v3/account',
        },
    };
}
exports.ConvertKitApi = ConvertKitApi;
//# sourceMappingURL=ConvertKitApi.credentials.js.map
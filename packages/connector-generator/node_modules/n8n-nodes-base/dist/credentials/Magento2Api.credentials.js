"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magento2Api = void 0;
class Magento2Api {
    name = 'magento2Api';
    displayName = 'Magento 2 API';
    documentationUrl = 'magento2';
    properties = [
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    test = {
        request: {
            baseURL: '={{$credentials.host}}',
            url: '/rest/default/V1/modules',
        },
    };
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };
}
exports.Magento2Api = Magento2Api;
//# sourceMappingURL=Magento2Api.credentials.js.map
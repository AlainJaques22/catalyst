"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.F5BigIpApi = void 0;
class F5BigIpApi {
    name = 'f5BigIpApi';
    displayName = 'F5 Big-IP API';
    documentationUrl = 'f5bigip';
    icon = 'file:icons/F5.svg';
    httpRequestNode = {
        name: 'F5 Big-IP',
        docsUrl: 'https://clouddocs.f5.com/api/',
        apiBaseUrl: '',
    };
    properties = [
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            auth: {
                username: '={{$credentials.username}}',
                password: '={{$credentials.password}}',
            },
        },
    };
}
exports.F5BigIpApi = F5BigIpApi;
//# sourceMappingURL=F5BigIpApi.credentials.js.map
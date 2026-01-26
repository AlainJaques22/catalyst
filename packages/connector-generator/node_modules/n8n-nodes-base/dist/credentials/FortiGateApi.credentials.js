"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortiGateApi = void 0;
class FortiGateApi {
    name = 'fortiGateApi';
    displayName = 'Fortinet FortiGate API';
    documentationUrl = 'fortigate';
    icon = 'file:icons/Fortinet.svg';
    httpRequestNode = {
        name: 'Fortinet FortiGate',
        docsUrl: 'https://docs.fortinet.com/document/fortigate/7.4.1/administration-guide/940602/using-apis',
        apiBaseUrl: '',
    };
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            qs: {
                access_token: '={{$credentials.accessToken}}',
            },
        },
    };
}
exports.FortiGateApi = FortiGateApi;
//# sourceMappingURL=FortiGateApi.credentials.js.map
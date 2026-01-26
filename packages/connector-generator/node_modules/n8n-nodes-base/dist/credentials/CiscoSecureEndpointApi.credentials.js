"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiscoSecureEndpointApi = void 0;
const axios_1 = __importDefault(require("axios"));
class CiscoSecureEndpointApi {
    name = 'ciscoSecureEndpointApi';
    displayName = 'Cisco Secure Endpoint (AMP) API';
    documentationUrl = 'ciscosecureendpoint';
    icon = { light: 'file:icons/Cisco.svg', dark: 'file:icons/Cisco.dark.svg' };
    httpRequestNode = {
        name: 'Cisco Secure Endpoint',
        docsUrl: 'https://developer.cisco.com/docs/secure-endpoint/',
        apiBaseUrl: '',
    };
    properties = [
        {
            displayName: 'Region',
            name: 'region',
            type: 'options',
            options: [
                {
                    name: 'Asia Pacific, Japan, and China',
                    value: 'apjc.amp',
                },
                {
                    name: 'Europe',
                    value: 'eu.amp',
                },
                {
                    name: 'North America',
                    value: 'amp',
                },
            ],
            default: 'amp',
        },
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Client Secret',
            name: 'clientSecret',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
        },
    ];
    async authenticate(credentials, requestOptions) {
        const clientId = credentials.clientId;
        const clientSecret = credentials.clientSecret;
        const region = credentials.region;
        const secureXToken = await (0, axios_1.default)({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            auth: {
                username: clientId,
                password: clientSecret,
            },
            method: 'POST',
            data: new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
            url: `https://visibility.${region}.cisco.com/iroh/oauth2/token`,
        });
        const secureEndpointToken = await (0, axios_1.default)({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
                Authorization: `Bearer ${secureXToken.data.access_token}`,
            },
            method: 'POST',
            data: new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
            url: `https://api.${region}.cisco.com/v3/access_tokens`,
        });
        const requestOptionsWithAuth = {
            ...requestOptions,
            headers: {
                ...requestOptions.headers,
                Authorization: `Bearer ${secureEndpointToken.data.access_token}`,
            },
        };
        return requestOptionsWithAuth;
    }
    test = {
        request: {
            baseURL: '=https://api.{{$credentials.region}}.cisco.com',
            url: '/v3/organizations',
            qs: {
                size: 10,
            },
        },
    };
}
exports.CiscoSecureEndpointApi = CiscoSecureEndpointApi;
//# sourceMappingURL=CiscoSecureEndpointApi.credentials.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesforceJwtApi = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class SalesforceJwtApi {
    name = 'salesforceJwtApi';
    displayName = 'Salesforce JWT API';
    documentationUrl = 'salesforce';
    properties = [
        {
            displayName: 'Environment Type',
            name: 'environment',
            type: 'options',
            options: [
                {
                    name: 'Production',
                    value: 'production',
                },
                {
                    name: 'Sandbox',
                    value: 'sandbox',
                },
            ],
            default: 'production',
        },
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
            required: true,
            description: 'Consumer Key from Salesforce Connected App',
        },
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Private Key',
            name: 'privateKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'Use the multiline editor. Make sure it is in standard PEM key format:<br />-----BEGIN PRIVATE KEY-----<br />KEY DATA GOES HERE<br />-----END PRIVATE KEY-----',
        },
    ];
    async authenticate(credentials, requestOptions) {
        const now = (0, moment_timezone_1.default)().unix();
        const authUrl = credentials.environment === 'sandbox'
            ? 'https://test.salesforce.com'
            : 'https://login.salesforce.com';
        const signature = jsonwebtoken_1.default.sign({
            iss: credentials.clientId,
            sub: credentials.username,
            aud: authUrl,
            exp: now + 3 * 60,
        }, credentials.privateKey, {
            algorithm: 'RS256',
            header: {
                alg: 'RS256',
            },
        });
        const axiosRequestConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            data: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: signature,
            }).toString(),
            url: `${authUrl}/services/oauth2/token`,
            responseType: 'json',
        };
        const result = await (0, axios_1.default)(axiosRequestConfig);
        const { access_token } = result.data;
        return {
            ...requestOptions,
            headers: {
                ...requestOptions.headers,
                Authorization: `Bearer ${access_token}`,
            },
        };
    }
    test = {
        request: {
            baseURL: '={{$credentials?.environment === "sandbox" ? "https://test.salesforce.com" : "https://login.salesforce.com"}}',
            url: '/services/oauth2/userinfo',
            method: 'GET',
        },
    };
}
exports.SalesforceJwtApi = SalesforceJwtApi;
//# sourceMappingURL=SalesforceJwtApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtopApi = void 0;
const constants_1 = require("../nodes/Airtop/constants");
class AirtopApi {
    name = 'airtopApi';
    displayName = 'Airtop API';
    documentationUrl = 'airtop';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            description: 'The Airtop API key. You can create one at <a href="https://portal.airtop.ai/api-keys" target="_blank">Airtop</a> for free.',
            required: true,
            typeOptions: {
                password: true,
            },
            noDataExpression: true,
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
                'api-key': '={{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            method: 'GET',
            baseURL: constants_1.BASE_URL,
            url: '/sessions',
            qs: {
                limit: 10,
            },
        },
    };
}
exports.AirtopApi = AirtopApi;
//# sourceMappingURL=AirtopApi.credentials.js.map
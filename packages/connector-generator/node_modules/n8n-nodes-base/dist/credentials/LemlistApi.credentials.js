"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemlistApi = void 0;
class LemlistApi {
    name = 'lemlistApi';
    displayName = 'Lemlist API';
    documentationUrl = 'lemlist';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    async authenticate(credentials, requestOptions) {
        const encodedApiKey = Buffer.from(':' + credentials.apiKey).toString('base64');
        requestOptions.headers.Authorization = `Basic ${encodedApiKey}`;
        requestOptions.headers['user-agent'] = 'n8n';
        return requestOptions;
    }
    test = {
        request: {
            baseURL: 'https://api.lemlist.com/api',
            url: '/campaigns',
        },
    };
}
exports.LemlistApi = LemlistApi;
//# sourceMappingURL=LemlistApi.credentials.js.map
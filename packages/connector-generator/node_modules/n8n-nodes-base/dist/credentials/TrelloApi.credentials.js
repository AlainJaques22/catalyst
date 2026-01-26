"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrelloApi = void 0;
class TrelloApi {
    name = 'trelloApi';
    displayName = 'Trello API';
    documentationUrl = 'trello';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
        },
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
        },
        {
            displayName: 'OAuth Secret',
            name: 'oauthSecret',
            type: 'hidden',
            typeOptions: { password: true },
            default: '',
        },
    ];
    async authenticate(credentials, requestOptions) {
        requestOptions.qs = {
            ...requestOptions.qs,
            key: credentials.apiKey,
            token: credentials.apiToken,
        };
        return requestOptions;
    }
    test = {
        request: {
            baseURL: 'https://api.trello.com',
            url: '=/1/tokens/{{$credentials.apiToken}}/member',
        },
    };
}
exports.TrelloApi = TrelloApi;
//# sourceMappingURL=TrelloApi.credentials.js.map
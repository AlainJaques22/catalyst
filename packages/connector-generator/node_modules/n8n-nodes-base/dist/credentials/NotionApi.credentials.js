"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionApi = void 0;
class NotionApi {
    name = 'notionApi';
    displayName = 'Notion API';
    documentationUrl = 'notion';
    properties = [
        {
            displayName: 'Internal Integration Secret',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    test = {
        request: {
            baseURL: 'https://api.notion.com/v1',
            url: '/users/me',
        },
    };
    async authenticate(credentials, requestOptions) {
        requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Bearer ${credentials.apiKey} `,
        };
        // if version it's not set, set it to last one
        // version is only set when the request is made from
        // the notion node, or was set explicitly in the http node
        if (!requestOptions.headers['Notion-Version']) {
            requestOptions.headers = {
                ...requestOptions.headers,
                'Notion-Version': '2022-02-22',
            };
        }
        return requestOptions;
    }
}
exports.NotionApi = NotionApi;
//# sourceMappingURL=NotionApi.credentials.js.map
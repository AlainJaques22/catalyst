"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoistApi = void 0;
class TodoistApi {
    name = 'todoistApi';
    displayName = 'Todoist API';
    documentationUrl = 'todoist';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.todoist.com/rest/v2',
            url: '/labels',
        },
    };
}
exports.TodoistApi = TodoistApi;
//# sourceMappingURL=TodoistApi.credentials.js.map
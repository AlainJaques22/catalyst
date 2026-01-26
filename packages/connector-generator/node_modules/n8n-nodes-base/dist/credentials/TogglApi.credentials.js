"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TogglApi = void 0;
class TogglApi {
    name = 'togglApi';
    displayName = 'Toggl API';
    documentationUrl = 'toggl';
    properties = [
        {
            displayName: 'Email Address',
            name: 'username',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
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
    test = {
        request: {
            baseURL: 'https://api.track.toggl.com/api/v9',
            url: '/me',
        },
    };
}
exports.TogglApi = TogglApi;
//# sourceMappingURL=TogglApi.credentials.js.map
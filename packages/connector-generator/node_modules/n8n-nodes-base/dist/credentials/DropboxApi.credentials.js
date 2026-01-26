"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropboxApi = void 0;
class DropboxApi {
    name = 'dropboxApi';
    displayName = 'Dropbox API';
    documentationUrl = 'dropbox';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'APP Access Type',
            name: 'accessType',
            type: 'options',
            options: [
                {
                    name: 'App Folder',
                    value: 'folder',
                },
                {
                    name: 'Full Dropbox',
                    value: 'full',
                },
            ],
            default: 'full',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.dropboxapi.com/2',
            url: '/users/get_current_account',
            method: 'POST',
        },
    };
}
exports.DropboxApi = DropboxApi;
//# sourceMappingURL=DropboxApi.credentials.js.map
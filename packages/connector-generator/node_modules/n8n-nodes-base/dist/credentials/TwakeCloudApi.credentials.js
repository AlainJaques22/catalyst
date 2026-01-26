"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwakeCloudApi = void 0;
class TwakeCloudApi {
    name = 'twakeCloudApi';
    displayName = 'Twake Cloud API';
    documentationUrl = 'twake';
    properties = [
        {
            displayName: 'Workspace Key',
            name: 'workspaceKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.workspaceKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://plugins.twake.app/plugins/n8n',
            url: '/channel',
            method: 'POST',
        },
    };
}
exports.TwakeCloudApi = TwakeCloudApi;
//# sourceMappingURL=TwakeCloudApi.credentials.js.map
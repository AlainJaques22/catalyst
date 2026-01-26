"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipedriveApi = void 0;
class PipedriveApi {
    name = 'pipedriveApi';
    displayName = 'Pipedrive API';
    documentationUrl = 'pipedrive';
    properties = [
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            qs: {
                api_token: '={{$credentials.apiToken}}',
            },
        },
    };
}
exports.PipedriveApi = PipedriveApi;
//# sourceMappingURL=PipedriveApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YourlsApi = void 0;
class YourlsApi {
    name = 'yourlsApi';
    displayName = 'Yourls API';
    documentationUrl = 'yourls';
    properties = [
        {
            displayName: 'Signature',
            name: 'signature',
            type: 'string',
            default: '',
        },
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'http://localhost:8080',
        },
    ];
}
exports.YourlsApi = YourlsApi;
//# sourceMappingURL=YourlsApi.credentials.js.map
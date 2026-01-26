"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormstackApi = void 0;
class FormstackApi {
    name = 'formstackApi';
    displayName = 'Formstack API';
    documentationUrl = 'formstacktrigger';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.FormstackApi = FormstackApi;
//# sourceMappingURL=FormstackApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnleashedSoftwareApi = void 0;
class UnleashedSoftwareApi {
    name = 'unleashedSoftwareApi';
    displayName = 'Unleashed API';
    documentationUrl = 'unleashedsoftware';
    properties = [
        {
            displayName: 'API ID',
            name: 'apiId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
        },
    ];
}
exports.UnleashedSoftwareApi = UnleashedSoftwareApi;
//# sourceMappingURL=UnleashedSoftwareApi.credentials.js.map
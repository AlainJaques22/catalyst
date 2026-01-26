"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomizyApi = void 0;
class AutomizyApi {
    name = 'automizyApi';
    displayName = 'Automizy API';
    documentationUrl = 'automizy';
    properties = [
        {
            displayName: 'This service may no longer exist and will be removed from n8n in a future release.',
            name: 'deprecated',
            type: 'notice',
            default: '',
        },
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.AutomizyApi = AutomizyApi;
//# sourceMappingURL=AutomizyApi.credentials.js.map
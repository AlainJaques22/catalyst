"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkableApi = void 0;
class WorkableApi {
    name = 'workableApi';
    displayName = 'Workable API';
    documentationUrl = 'workable';
    properties = [
        {
            displayName: 'Subdomain',
            name: 'subdomain',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.WorkableApi = WorkableApi;
//# sourceMappingURL=WorkableApi.credentials.js.map
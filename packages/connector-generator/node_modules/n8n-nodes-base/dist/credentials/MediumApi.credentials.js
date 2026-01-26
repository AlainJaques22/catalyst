"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumApi = void 0;
class MediumApi {
    name = 'mediumApi';
    displayName = 'Medium API';
    documentationUrl = 'medium';
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
exports.MediumApi = MediumApi;
//# sourceMappingURL=MediumApi.credentials.js.map
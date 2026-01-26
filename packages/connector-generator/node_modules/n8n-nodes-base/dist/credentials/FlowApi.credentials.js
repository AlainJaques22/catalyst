"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowApi = void 0;
class FlowApi {
    name = 'flowApi';
    displayName = 'Flow API';
    documentationUrl = 'flow';
    properties = [
        {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'number',
            default: 0,
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
exports.FlowApi = FlowApi;
//# sourceMappingURL=FlowApi.credentials.js.map
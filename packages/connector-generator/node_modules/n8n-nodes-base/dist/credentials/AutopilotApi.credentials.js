"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutopilotApi = void 0;
class AutopilotApi {
    name = 'autopilotApi';
    displayName = 'Autopilot API';
    documentationUrl = 'autopilot';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.AutopilotApi = AutopilotApi;
//# sourceMappingURL=AutopilotApi.credentials.js.map
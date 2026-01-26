"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UptimeRobotApi = void 0;
class UptimeRobotApi {
    name = 'uptimeRobotApi';
    displayName = 'Uptime Robot API';
    documentationUrl = 'uptimerobot';
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
exports.UptimeRobotApi = UptimeRobotApi;
//# sourceMappingURL=UptimeRobotApi.credentials.js.map
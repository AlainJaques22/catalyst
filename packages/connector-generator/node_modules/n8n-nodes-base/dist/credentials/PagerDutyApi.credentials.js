"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagerDutyApi = void 0;
class PagerDutyApi {
    name = 'pagerDutyApi';
    displayName = 'PagerDuty API';
    documentationUrl = 'pagerduty';
    properties = [
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.PagerDutyApi = PagerDutyApi;
//# sourceMappingURL=PagerDutyApi.credentials.js.map
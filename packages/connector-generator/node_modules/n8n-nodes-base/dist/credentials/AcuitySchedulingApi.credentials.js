"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcuitySchedulingApi = void 0;
class AcuitySchedulingApi {
    name = 'acuitySchedulingApi';
    displayName = 'Acuity Scheduling API';
    documentationUrl = 'acuityscheduling';
    properties = [
        {
            displayName: 'User ID',
            name: 'userId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.AcuitySchedulingApi = AcuitySchedulingApi;
//# sourceMappingURL=AcuitySchedulingApi.credentials.js.map
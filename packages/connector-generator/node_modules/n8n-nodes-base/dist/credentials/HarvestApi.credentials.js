"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestApi = void 0;
class HarvestApi {
    name = 'harvestApi';
    displayName = 'Harvest API';
    documentationUrl = 'harvest';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Visit your account details page, and grab the Access Token. See <a href="https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/">Harvest Personal Access Tokens</a>.',
        },
    ];
}
exports.HarvestApi = HarvestApi;
//# sourceMappingURL=HarvestApi.credentials.js.map
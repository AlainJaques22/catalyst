"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumanticAiApi = void 0;
class HumanticAiApi {
    name = 'humanticAiApi';
    displayName = 'Humantic AI API';
    documentationUrl = 'humanticai';
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
exports.HumanticAiApi = HumanticAiApi;
//# sourceMappingURL=HumanticAiApi.credentials.js.map
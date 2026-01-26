"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBirdApi = void 0;
class MessageBirdApi {
    name = 'messageBirdApi';
    displayName = 'MessageBird API';
    documentationUrl = 'messagebird';
    properties = [
        {
            displayName: 'API Key',
            name: 'accessKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.MessageBirdApi = MessageBirdApi;
//# sourceMappingURL=MessageBirdApi.credentials.js.map
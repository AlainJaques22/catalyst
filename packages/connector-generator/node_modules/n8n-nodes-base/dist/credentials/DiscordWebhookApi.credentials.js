"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordWebhookApi = void 0;
class DiscordWebhookApi {
    name = 'discordWebhookApi';
    displayName = 'Discord Webhook';
    documentationUrl = 'discord';
    properties = [
        {
            displayName: 'Webhook URL',
            name: 'webhookUri',
            type: 'string',
            required: true,
            default: '',
            placeholder: 'https://discord.com/api/webhooks/ID/TOKEN',
            typeOptions: {
                password: true,
            },
        },
    ];
    test = {
        request: {
            baseURL: '={{ $credentials.webhookUri }}',
        },
    };
}
exports.DiscordWebhookApi = DiscordWebhookApi;
//# sourceMappingURL=DiscordWebhookApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBotApi = void 0;
class DiscordBotApi {
    name = 'discordBotApi';
    displayName = 'Discord Bot API';
    documentationUrl = 'discord';
    properties = [
        {
            displayName: 'Bot Token',
            name: 'botToken',
            type: 'string',
            default: '',
            required: true,
            typeOptions: {
                password: true,
            },
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bot {{$credentials.botToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://discord.com/api/v10/',
            url: '/users/@me/guilds',
        },
    };
}
exports.DiscordBotApi = DiscordBotApi;
//# sourceMappingURL=DiscordBotApi.credentials.js.map
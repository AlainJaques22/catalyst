"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const common_description_1 = require("../common.description");
const properties = [
    ...common_description_1.sendToProperties,
    {
        displayName: 'Message',
        name: 'content',
        type: 'string',
        default: '',
        description: 'The content of the message (up to 2000 characters)',
        placeholder: 'e.g. My message',
        typeOptions: {
            rows: 2,
        },
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Flags',
                name: 'flags',
                type: 'multiOptions',
                default: [],
                description: 'Message flags. <a href="https://discord.com/developers/docs/resources/channel#message-object-message-flags" target="_blank">More info</a>.”.',
                options: [
                    {
                        name: 'Suppress Embeds',
                        value: 'SUPPRESS_EMBEDS',
                    },
                    {
                        name: 'Suppress Notifications',
                        value: 'SUPPRESS_NOTIFICATIONS',
                    },
                ],
            },
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                displayName: 'Message to Reply to',
                name: 'message_reference',
                type: 'string',
                default: '',
                description: 'Fill this to make your message a reply. Add the message ID.',
                placeholder: 'e.g. 1059467601836773386',
            },
            {
                displayName: 'Text-to-Speech (TTS)',
                name: 'tts',
                type: 'boolean',
                default: false,
                description: 'Whether to have a bot reading the message directly in the channel',
            },
        ],
    },
    common_description_1.embedsFixedCollection,
    common_description_1.filesFixedCollection,
];
const displayOptions = {
    show: {
        resource: ['message'],
        operation: ['send'],
    },
    hide: {
        authentication: ['webhook'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(guildId, userGuilds) {
    const returnData = [];
    const items = this.getInputData();
    const isOAuth2 = this.getNodeParameter('authentication', 0) === 'oAuth2';
    for (let i = 0; i < items.length; i++) {
        const content = this.getNodeParameter('content', i);
        const options = (0, utils_1.prepareOptions)(this.getNodeParameter('options', i, {}), guildId);
        const embeds = this.getNodeParameter('embeds', i, undefined)
            ?.values;
        const files = this.getNodeParameter('files', i, undefined)
            ?.values;
        const body = {
            content,
            ...options,
        };
        if (embeds) {
            body.embeds = utils_1.prepareEmbeds.call(this, embeds);
        }
        try {
            returnData.push(...(await utils_1.sendDiscordMessage.call(this, {
                guildId,
                userGuilds,
                isOAuth2,
                body,
                items,
                files,
                itemIndex: i,
            })));
        }
        catch (error) {
            const err = utils_1.parseDiscordError.call(this, error, i);
            if (this.continueOnFail()) {
                returnData.push(...utils_1.prepareErrorData.call(this, err, i));
                continue;
            }
            throw err;
        }
    }
    return returnData;
}
//# sourceMappingURL=send.operation.js.map
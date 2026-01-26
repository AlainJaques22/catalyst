"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const common_description_1 = require("../common.description");
const properties = [
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
                displayName: 'Avatar URL',
                name: 'avatar_url',
                type: 'string',
                default: '',
                description: 'Override the default avatar of the webhook',
                placeholder: 'e.g. https://example.com/image.png',
            },
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
                displayName: 'Text-to-Speech (TTS)',
                name: 'tts',
                type: 'boolean',
                default: false,
                description: 'Whether to have a bot reading the message directly in the channel',
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                description: 'Override the default username of the webhook',
                placeholder: 'e.g. My Username',
            },
            {
                displayName: 'Wait',
                name: 'wait',
                type: 'boolean',
                default: false,
                description: 'Whether wait for the message to be created before returning its response',
            },
        ],
    },
    common_description_1.embedsFixedCollection,
    common_description_1.filesFixedCollection,
];
const displayOptions = {
    show: {
        operation: ['sendLegacy'],
    },
    hide: {
        authentication: ['botToken', 'oAuth2'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute() {
    const returnData = [];
    const items = this.getInputData();
    for (let i = 0; i < items.length; i++) {
        const content = this.getNodeParameter('content', i);
        const options = (0, utils_1.prepareOptions)(this.getNodeParameter('options', i, {}));
        const embeds = this.getNodeParameter('embeds', i, undefined)
            ?.values;
        const files = this.getNodeParameter('files', i, undefined)
            ?.values;
        let qs = undefined;
        if (options.wait) {
            qs = {
                wait: options.wait,
            };
            delete options.wait;
        }
        const body = {
            content,
            ...options,
        };
        if (embeds) {
            body.embeds = utils_1.prepareEmbeds.call(this, embeds);
        }
        try {
            let response = [];
            if (files?.length) {
                const multiPartBody = await utils_1.prepareMultiPartForm.call(this, items, files, body, i);
                response = await transport_1.discordApiMultiPartRequest.call(this, 'POST', '', multiPartBody);
            }
            else {
                response = await transport_1.discordApiRequest.call(this, 'POST', '', body, qs);
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), { itemData: { item: i } });
            returnData.push(...executionData);
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
//# sourceMappingURL=sendLegacy.operation.js.map
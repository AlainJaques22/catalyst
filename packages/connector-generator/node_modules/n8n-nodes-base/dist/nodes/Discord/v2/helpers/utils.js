"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimplifyFunction = void 0;
exports.parseDiscordError = parseDiscordError;
exports.prepareErrorData = prepareErrorData;
exports.prepareOptions = prepareOptions;
exports.prepareEmbeds = prepareEmbeds;
exports.prepareMultiPartForm = prepareMultiPartForm;
exports.checkAccessToGuild = checkAccessToGuild;
exports.checkAccessToChannel = checkAccessToChannel;
exports.setupChannelGetter = setupChannelGetter;
exports.sendDiscordMessage = sendDiscordMessage;
exports.createSendAndWaitMessageBody = createSendAndWaitMessageBody;
const form_data_1 = __importDefault(require("form-data"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const mime_types_1 = require("mime-types");
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../../../utils/sendAndWait/utils");
const utilities_1 = require("../../../../utils/utilities");
const transport_1 = require("../transport");
const createSimplifyFunction = (includedFields) => (item) => {
    const result = {};
    for (const field of includedFields) {
        if (item[field] === undefined)
            continue;
        result[field] = item[field];
    }
    return result;
};
exports.createSimplifyFunction = createSimplifyFunction;
function parseDiscordError(error, itemIndex = 0) {
    let errorData = error.cause?.error;
    const errorOptions = { itemIndex };
    error.description =
        Array.isArray(error.messages) && error.messages.length ? error.messages[0] : error.description;
    if (!errorData && error.description) {
        try {
            const errorString = error.description.split(' - ')[1];
            if (errorString) {
                errorData = (0, n8n_workflow_1.jsonParse)(errorString);
            }
        }
        catch (err) { }
    }
    if (errorData?.message) {
        errorOptions.message = errorData.message;
    }
    if (error?.message?.toLowerCase()?.includes('bad request') && errorData) {
        if (errorData?.message) {
            errorOptions.message = errorData.message;
        }
        if (errorData?.errors?.embeds) {
            const embedErrors = errorData.errors.embeds?.[0];
            const embedErrorsKeys = Object.keys(embedErrors).map((key) => (0, utilities_1.capitalize)(key));
            if (embedErrorsKeys.length) {
                const message = embedErrorsKeys.length === 1
                    ? `The parameter ${embedErrorsKeys[0]} is not properly formatted`
                    : `The parameters ${embedErrorsKeys.join(', ')} are not properly formatted`;
                errorOptions.message = message;
                errorOptions.description = 'Review the formatting or clear it';
            }
            return new n8n_workflow_1.NodeOperationError(this.getNode(), errorData.errors, errorOptions);
        }
        if (errorData?.errors?.message_reference) {
            errorOptions.message = "The message to reply to ID can't be found";
            errorOptions.description =
                'Check the "Message to Reply to" parameter and remove it if you don\'t want to reply to an existing message';
            return new n8n_workflow_1.NodeOperationError(this.getNode(), errorData.errors, errorOptions);
        }
        if (errorOptions.message === 'Cannot send an empty message') {
            errorOptions.description =
                'Something has to be send to the channel whether it is a message, an embed or a file';
        }
    }
    return new n8n_workflow_1.NodeOperationError(this.getNode(), errorData || error, errorOptions);
}
function prepareErrorData(error, i) {
    let description = error.description;
    try {
        description = JSON.parse(error.description);
    }
    catch (err) { }
    return this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message, description }), { itemData: { item: i } });
}
function prepareOptions(options, guildId) {
    if (options.flags) {
        if (options.flags.length === 2) {
            options.flags = (1 << 2) + (1 << 12);
        }
        else if (options.flags.includes('SUPPRESS_EMBEDS')) {
            options.flags = 1 << 2;
        }
        else if (options.flags.includes('SUPPRESS_NOTIFICATIONS')) {
            options.flags = 1 << 12;
        }
    }
    if (options.message_reference) {
        options.message_reference = {
            message_id: options.message_reference,
            guild_id: guildId,
        };
    }
    return options;
}
function prepareEmbeds(embeds) {
    return embeds
        .map((embed) => {
        let embedReturnData = {};
        if (embed.inputMethod === 'json') {
            if (typeof embed.json === 'object') {
                embedReturnData = embed.json;
            }
            try {
                embedReturnData = (0, n8n_workflow_1.jsonParse)(embed.json);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Not a valid JSON', error);
            }
        }
        else {
            delete embed.inputMethod;
            for (const key of Object.keys(embed)) {
                if (embed[key] !== '') {
                    embedReturnData[key] = embed[key];
                }
            }
        }
        if (embedReturnData.author) {
            embedReturnData.author = {
                name: embedReturnData.author,
            };
        }
        if (embedReturnData.color && typeof embedReturnData.color === 'string') {
            embedReturnData.color = parseInt(embedReturnData.color.replace('#', ''), 16);
        }
        if (embedReturnData.video) {
            embedReturnData.video = {
                url: embedReturnData.video,
                width: 1270,
                height: 720,
            };
        }
        if (embedReturnData.thumbnail) {
            embedReturnData.thumbnail = {
                url: embedReturnData.thumbnail,
            };
        }
        if (embedReturnData.image) {
            embedReturnData.image = {
                url: embedReturnData.image,
            };
        }
        return embedReturnData;
    })
        .filter((embed) => !(0, isEmpty_1.default)(embed));
}
async function prepareMultiPartForm(items, files, jsonPayload, i) {
    const multiPartBody = new form_data_1.default();
    const attachments = [];
    const filesData = [];
    for (const [index, file] of files.entries()) {
        const binaryData = items[i].binary?.[file.inputFieldName];
        if (!binaryData) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Input item [${i}] does not contain binary data on property ${file.inputFieldName}`);
        }
        let filename = binaryData.fileName;
        if (!filename.includes('.')) {
            if (binaryData.fileExtension) {
                filename += `.${binaryData.fileExtension}`;
            }
            if (binaryData.mimeType) {
                filename += `.${(0, mime_types_1.extension)(binaryData.mimeType)}`;
            }
        }
        attachments.push({
            id: index,
            filename,
        });
        filesData.push({
            data: await this.helpers.getBinaryDataBuffer(i, file.inputFieldName),
            name: filename,
            mime: binaryData.mimeType,
        });
    }
    multiPartBody.append('payload_json', JSON.stringify({ ...jsonPayload, attachments }), {
        contentType: 'application/json',
    });
    for (const [index, binaryData] of filesData.entries()) {
        multiPartBody.append(`files[${index}]`, binaryData.data, {
            contentType: binaryData.name,
            filename: binaryData.mime,
        });
    }
    return multiPartBody;
}
function checkAccessToGuild(node, guildId, userGuilds, itemIndex = 0) {
    if (!userGuilds.some((guild) => guild.id === guildId)) {
        throw new n8n_workflow_1.NodeOperationError(node, `You do not have access to the guild with the id ${guildId}`, {
            itemIndex,
            level: 'warning',
        });
    }
}
async function checkAccessToChannel(channelId, userGuilds, itemIndex = 0) {
    let guildId = '';
    try {
        const channel = await transport_1.discordApiRequest.call(this, 'GET', `/channels/${channelId}`);
        guildId = channel.guild_id;
    }
    catch (error) { }
    if (!guildId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Could not find server for channel with the id ${channelId}`, {
            itemIndex,
        });
    }
    checkAccessToGuild(this.getNode(), guildId, userGuilds, itemIndex);
}
async function setupChannelGetter(userGuilds) {
    const isOAuth2 = this.getNodeParameter('authentication', 0) === 'oAuth2';
    return async (i) => {
        const channelId = this.getNodeParameter('channelId', i, undefined, {
            extractValue: true,
        });
        if (isOAuth2)
            await checkAccessToChannel.call(this, channelId, userGuilds, i);
        return channelId;
    };
}
async function sendDiscordMessage({ guildId, userGuilds, isOAuth2, body, items, files = [], itemIndex = 0, }) {
    const sendTo = this.getNodeParameter('sendTo', itemIndex);
    let channelId = '';
    if (sendTo === 'user') {
        const userId = this.getNodeParameter('userId', itemIndex, undefined, {
            extractValue: true,
        });
        if (isOAuth2) {
            try {
                await transport_1.discordApiRequest.call(this, 'GET', `/guilds/${guildId}/members/${userId}`);
            }
            catch (error) {
                if (error instanceof n8n_workflow_1.NodeApiError && error.httpCode === '404') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `User with the id ${userId} is not a member of the selected guild`, {
                        itemIndex,
                    });
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                    itemIndex,
                });
            }
        }
        channelId = (await transport_1.discordApiRequest.call(this, 'POST', '/users/@me/channels', {
            recipient_id: userId,
        })).id;
        if (!channelId) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Could not create a channel to send direct message to', { itemIndex });
        }
    }
    if (sendTo === 'channel') {
        channelId = this.getNodeParameter('channelId', itemIndex, undefined, {
            extractValue: true,
        });
    }
    if (isOAuth2 && sendTo !== 'user') {
        await checkAccessToChannel.call(this, channelId, userGuilds, itemIndex);
    }
    if (!channelId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Channel ID is required', {
            itemIndex,
        });
    }
    let response = [];
    if (files?.length) {
        const multiPartBody = await prepareMultiPartForm.call(this, items, files, body, itemIndex);
        response = await transport_1.discordApiMultiPartRequest.call(this, 'POST', `/channels/${channelId}/messages`, multiPartBody);
    }
    else {
        response = await transport_1.discordApiRequest.call(this, 'POST', `/channels/${channelId}/messages`, body);
    }
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), { itemData: { item: itemIndex } });
    return executionData;
}
function createSendAndWaitMessageBody(context) {
    const config = (0, utils_1.getSendAndWaitConfig)(context);
    let description = config.message;
    if (config.appendAttribution !== false) {
        const instanceId = context.getInstanceId();
        const attributionText = 'This message was sent automatically with ';
        const link = (0, utilities_1.createUtmCampaignLink)('n8n-nodes-base.discord', instanceId);
        description = `${config.message}\n\n_${attributionText}_[n8n](${link})`;
    }
    const body = {
        embeds: [
            {
                description,
                color: 5814783,
            },
        ],
        components: [
            {
                type: 1,
                components: config.options.map((option) => {
                    return {
                        type: 2,
                        style: 5,
                        label: option.label,
                        url: option.url,
                    };
                }),
            },
        ],
    };
    return body;
}
//# sourceMappingURL=utils.js.map
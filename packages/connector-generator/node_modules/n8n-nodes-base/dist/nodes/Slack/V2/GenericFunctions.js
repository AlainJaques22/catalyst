"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackApiRequest = slackApiRequest;
exports.slackApiRequestAllItems = slackApiRequestAllItems;
exports.getMessageContent = getMessageContent;
exports.validateJSON = validateJSON;
exports.getTarget = getTarget;
exports.processThreadOptions = processThreadOptions;
exports.createSendAndWaitMessageBody = createSendAndWaitMessageBody;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../../utils/sendAndWait/utils");
const utilities_1 = require("../../../utils/utilities");
async function slackApiRequest(method, resource, body = {}, query = {}, headers = undefined, option = {}) {
    const authenticationMethod = this.getNodeParameter('authentication', 0, 'accessToken');
    let options = {
        method,
        headers: headers ?? {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body,
        qs: query,
        uri: resource.startsWith('https') ? resource : `https://slack.com/api${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    if (Object.keys(query).length === 0) {
        delete options.qs;
    }
    const oAuth2Options = {
        tokenType: 'Bearer',
        property: 'authed_user.access_token',
    };
    const credentialType = authenticationMethod === 'accessToken' ? 'slackApi' : 'slackOAuth2Api';
    const response = await this.helpers.requestWithAuthentication.call(this, credentialType, options, {
        oauth2: oAuth2Options,
    });
    if (response.ok === false) {
        if (response.error === 'paid_teams_only') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Your current Slack plan does not include the resource '${this.getNodeParameter('resource', 0)}'`, {
                description: 'Hint: Upgrade to a Slack plan that includes the functionality you want to use.',
                level: 'warning',
            });
        }
        else if (response.error === 'missing_scope') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Your Slack credential is missing required Oauth Scopes', {
                description: `Add the following scope(s) to your Slack App: ${response.needed}`,
                level: 'warning',
            });
        }
        else if (response.error === 'not_admin') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Need higher Role Level for this Operation (e.g. Owner or Admin Rights)', {
                description: 'Hint: Check the Role of your Slack App Integration. For more information see the Slack Documentation - https://slack.com/help/articles/360018112273-Types-of-roles-in-Slack',
                level: 'warning',
            });
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Slack error response: ' + JSON.stringify(response.error));
    }
    if (response.ts !== undefined) {
        Object.assign(response, { message_timestamp: response.ts });
        delete response.ts;
    }
    return response;
}
async function slackApiRequestAllItems(propertyName, method, endpoint, 
// tslint:disable-next-line:no-any
body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.page = 1;
    //if the endpoint uses legacy pagination use count
    //https://api.slack.com/docs/pagination#classic
    if (endpoint.includes('files.list')) {
        query.count = 100;
    }
    else {
        query.limit = query.limit ?? 100;
    }
    do {
        responseData = await slackApiRequest.call(this, method, endpoint, body, query);
        query.cursor = (0, get_1.default)(responseData, 'response_metadata.next_cursor');
        query.page++;
        returnData.push.apply(returnData, responseData[propertyName].matches ?? responseData[propertyName]);
    } while ((responseData.response_metadata?.next_cursor !== undefined &&
        responseData.response_metadata.next_cursor !== '' &&
        responseData.response_metadata.next_cursor !== null) ||
        (responseData.paging?.pages !== undefined &&
            responseData.paging.page !== undefined &&
            responseData.paging.page < responseData.paging.pages) ||
        (responseData[propertyName].paging?.pages !== undefined &&
            responseData[propertyName].paging.page !== undefined &&
            responseData[propertyName].paging.page < responseData[propertyName].paging.pages));
    return returnData;
}
function getMessageContent(i, nodeVersion, instanceId) {
    const includeLinkToWorkflow = this.getNodeParameter('otherOptions.includeLinkToWorkflow', i, nodeVersion >= 2.1 ? true : false);
    const { id } = this.getWorkflow();
    const automatedMessage = `_Automated with this <${this.getInstanceBaseUrl()}workflow/${id}?utm_source=n8n-internal&utm_medium=powered_by&utm_campaign=${encodeURIComponent('n8n-nodes-base.slack')}${instanceId ? '_' + instanceId : ''}|n8n workflow>_`;
    const messageType = this.getNodeParameter('messageType', i);
    let content = {};
    const text = this.getNodeParameter('text', i, '');
    switch (messageType) {
        case 'text':
            content = {
                text: includeLinkToWorkflow ? `${text}\n${automatedMessage}` : text,
            };
            break;
        case 'block':
            content = this.getNodeParameter('blocksUi', i, {}, { ensureType: 'object' });
            if (includeLinkToWorkflow && Array.isArray(content.blocks)) {
                content.blocks.push({
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: automatedMessage,
                    },
                });
            }
            if (text) {
                content.text = text;
            }
            break;
        case 'attachment':
            const attachmentsUI = this.getNodeParameter('attachments', i);
            const attachments = [];
            for (const attachment of attachmentsUI) {
                if (attachment.fields !== undefined) {
                    if (attachment?.fields?.item) {
                        attachment.fields = attachment?.fields?.item;
                    }
                }
                attachments.push(attachment);
            }
            content = { attachments };
            if (includeLinkToWorkflow && Array.isArray(content.attachments)) {
                content.attachments.push({
                    text: automatedMessage,
                });
            }
            break;
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The message type "${messageType}" is not known!`);
    }
    return content;
}
// tslint:disable-next-line:no-any
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
function getTarget(context, itemIndex, idType) {
    let target = '';
    if (idType === 'channel') {
        target = context.getNodeParameter('channelId', itemIndex, undefined, {
            extractValue: true,
        });
    }
    else {
        target = context.getNodeParameter('user', itemIndex, undefined, {
            extractValue: true,
        });
    }
    if (idType === 'user' &&
        context.getNodeParameter('user', itemIndex).mode === 'username') {
        target = target.slice(0, 1) === '@' ? target : `@${target}`;
    }
    return target;
}
function processThreadOptions(threadOptions) {
    const result = {};
    if (threadOptions?.replyValues) {
        const replyValues = threadOptions.replyValues;
        if (replyValues.thread_ts) {
            result.thread_ts = replyValues.thread_ts;
        }
        if (replyValues.reply_broadcast !== undefined) {
            result.reply_broadcast = replyValues.reply_broadcast;
        }
    }
    return result;
}
function createSendAndWaitMessageBody(context) {
    const select = context.getNodeParameter('select', 0);
    const target = getTarget(context, 0, select);
    const config = (0, utils_1.getSendAndWaitConfig)(context);
    const body = {
        channel: target,
        blocks: [
            {
                type: 'divider',
            },
            {
                type: 'section',
                text: {
                    type: context.getNode().typeVersion > 2.2 ? 'mrkdwn' : 'plain_text',
                    text: config.message,
                    emoji: true,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'plain_text',
                    text: ' ',
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'actions',
                elements: config.options.map((option) => {
                    return {
                        type: 'button',
                        style: option.style === 'primary' ? 'primary' : undefined,
                        text: {
                            type: 'plain_text',
                            text: option.label,
                            emoji: true,
                        },
                        url: option.url,
                    };
                }),
            },
        ],
    };
    if (config.appendAttribution) {
        const instanceId = context.getInstanceId();
        const attributionText = 'This message was sent automatically with ';
        const link = (0, utilities_1.createUtmCampaignLink)('n8n-nodes-base.slack', instanceId);
        body.blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `${attributionText} _<${link}|n8n>_`,
            },
        });
    }
    if (context.getNode().typeVersion > 2.2 && body.blocks?.[1]?.type === 'section') {
        delete body.blocks[1].text.emoji;
    }
    return body;
}
//# sourceMappingURL=GenericFunctions.js.map
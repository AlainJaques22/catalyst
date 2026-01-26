"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.WHATSAPP_BASE_URL = void 0;
exports.appWebhookSubscriptionList = appWebhookSubscriptionList;
exports.appWebhookSubscriptionCreate = appWebhookSubscriptionCreate;
exports.appWebhookSubscriptionDelete = appWebhookSubscriptionDelete;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../utils/utilities");
exports.WHATSAPP_BASE_URL = 'https://graph.facebook.com/v13.0/';
async function appAccessTokenRead() {
    const credentials = await this.getCredentials('whatsAppTriggerApi');
    const options = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: {
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            grant_type: 'client_credentials',
        },
        url: 'https://graph.facebook.com/v19.0/oauth/access_token',
        json: true,
    };
    try {
        return await this.helpers.httpRequest.call(this, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function whatsappApiRequest(method, resource, body, qs = {}) {
    const tokenResponse = await appAccessTokenRead.call(this);
    const appAccessToken = tokenResponse.access_token;
    const options = {
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${appAccessToken}`,
        },
        method,
        qs,
        body: body?.payload,
        url: `https://graph.facebook.com/v19.0${resource}`,
        json: true,
    };
    try {
        return await this.helpers.httpRequest.call(this, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function appWebhookSubscriptionList(appId) {
    const response = (await whatsappApiRequest.call(this, 'GET', `/${appId}/subscriptions`));
    return response.data;
}
async function appWebhookSubscriptionCreate(appId, subscription) {
    return await whatsappApiRequest.call(this, 'POST', `/${appId}/subscriptions`, {
        type: 'form',
        payload: { ...subscription },
    });
}
async function appWebhookSubscriptionDelete(appId, object) {
    return await whatsappApiRequest.call(this, 'DELETE', `/${appId}/subscriptions`, {
        type: 'form',
        payload: { object },
    });
}
const createMessage = (sendAndWaitConfig, phoneNumberId, recipientPhoneNumber, instanceId) => {
    const buttons = sendAndWaitConfig.options.map((option) => {
        return `*${option.label}:*\n_${option.url}_\n\n`;
    });
    let n8nAttribution = '';
    if (sendAndWaitConfig.appendAttribution) {
        const attributionText = 'This message was sent automatically with ';
        const link = (0, utilities_1.createUtmCampaignLink)('n8n-nodes-base.whatsapp', instanceId);
        n8nAttribution = `\n\n${attributionText}${link}`;
    }
    return {
        baseURL: exports.WHATSAPP_BASE_URL,
        method: 'POST',
        url: `${phoneNumberId}/messages`,
        body: {
            messaging_product: 'whatsapp',
            text: {
                body: `${sendAndWaitConfig.message}\n\n${buttons.join('')}${n8nAttribution}`,
            },
            type: 'text',
            to: recipientPhoneNumber,
        },
    };
};
exports.createMessage = createMessage;
//# sourceMappingURL=GenericFunctions.js.map
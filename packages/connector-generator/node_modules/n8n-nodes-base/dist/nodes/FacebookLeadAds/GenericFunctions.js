"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookApiRequest = facebookApiRequest;
exports.appAccessTokenRead = appAccessTokenRead;
exports.facebookAppApiRequest = facebookAppApiRequest;
exports.appWebhookSubscriptionList = appWebhookSubscriptionList;
exports.appWebhookSubscriptionCreate = appWebhookSubscriptionCreate;
exports.appWebhookSubscriptionDelete = appWebhookSubscriptionDelete;
exports.facebookPageList = facebookPageList;
exports.facebookEntityDetail = facebookEntityDetail;
exports.facebookPageApiRequest = facebookPageApiRequest;
exports.installAppOnPage = installAppOnPage;
exports.facebookFormList = facebookFormList;
const n8n_workflow_1 = require("n8n-workflow");
async function facebookApiRequest(method, resource, body = {}, qs = {}) {
    const options = {
        headers: {
            accept: 'application/json',
        },
        method,
        qs,
        body,
        gzip: true,
        uri: `https://graph.facebook.com/v21.0${resource}`,
        json: true,
    };
    try {
        return await this.helpers.requestOAuth2.call(this, 'facebookLeadAdsOAuth2Api', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: error?.error?.error?.message,
        });
    }
}
async function appAccessTokenRead() {
    const credentials = await this.getCredentials('facebookLeadAdsOAuth2Api');
    const options = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        form: {
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            grant_type: 'client_credentials',
        },
        uri: credentials.accessTokenUrl,
        json: true,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function facebookAppApiRequest(method, resource, body, qs = {}) {
    const tokenResponse = await appAccessTokenRead.call(this);
    const appAccessToken = tokenResponse.access_token;
    const options = {
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${appAccessToken}`,
        },
        method,
        qs,
        gzip: true,
        uri: `https://graph.facebook.com/v21.0${resource}`,
        json: true,
    };
    if (body?.type === 'json') {
        options.body = body.payload;
    }
    else if (body?.type === 'form') {
        options.form = body.payload;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function appWebhookSubscriptionList(appId) {
    const response = (await facebookAppApiRequest.call(this, 'GET', `/${appId}/subscriptions`));
    return response.data;
}
async function appWebhookSubscriptionCreate(appId, subscription) {
    return await facebookAppApiRequest.call(this, 'POST', `/${appId}/subscriptions`, {
        type: 'form',
        payload: { ...subscription },
    });
}
async function appWebhookSubscriptionDelete(appId, object) {
    return await facebookAppApiRequest.call(this, 'DELETE', `/${appId}/subscriptions`, {
        type: 'form',
        payload: { object },
    });
}
async function facebookPageList(cursor) {
    const response = (await facebookApiRequest.call(this, 'GET', '/me/accounts', {}, { cursor, fields: 'id,name' }));
    return response;
}
async function facebookEntityDetail(entityId, fields = 'id,name,access_token') {
    return await facebookApiRequest.call(this, 'GET', `/${entityId}`, {}, { fields });
}
async function facebookPageApiRequest(method, resource, body = {}, qs = {}) {
    const pageId = this.getNodeParameter('page', '', { extractValue: true });
    const page = (await facebookEntityDetail.call(this, pageId));
    const pageAccessToken = page.access_token;
    const options = {
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${pageAccessToken}`,
        },
        method,
        qs,
        body,
        gzip: true,
        uri: `https://graph.facebook.com/v21.0${resource}`,
        json: true,
    };
    try {
        return await this.helpers.request.call(this, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function installAppOnPage(pageId, fields) {
    return await facebookPageApiRequest.call(this, 'POST', `/${pageId}/subscribed_apps`, {}, { subscribed_fields: fields });
}
async function facebookFormList(pageId, cursor) {
    const response = (await facebookPageApiRequest.call(this, 'GET', `/${pageId}/leadgen_forms`, {}, { cursor, fields: 'id,name' }));
    return response;
}
//# sourceMappingURL=GenericFunctions.js.map
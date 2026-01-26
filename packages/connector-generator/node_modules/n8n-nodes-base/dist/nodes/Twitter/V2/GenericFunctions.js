"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterApiRequest = twitterApiRequest;
exports.twitterApiRequestAllItems = twitterApiRequestAllItems;
exports.returnId = returnId;
exports.returnIdFromUsername = returnIdFromUsername;
const n8n_workflow_1 = require("n8n-workflow");
async function twitterApiRequest(method, resource, body = {}, qs = {}, fullOutput, uri, option = {}) {
    let options = {
        method,
        body,
        qs,
        url: uri || `https://api.twitter.com/2${resource}`,
        json: true,
    };
    try {
        if (Object.keys(option).length !== 0) {
            options = Object.assign({}, options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(qs).length === 0) {
            delete options.qs;
        }
        if (fullOutput) {
            return await this.helpers.requestOAuth2.call(this, 'twitterOAuth2Api', options);
        }
        else {
            const { data } = await this.helpers.requestOAuth2.call(this, 'twitterOAuth2Api', options);
            return data;
        }
    }
    catch (error) {
        if (error.error?.required_enrollment === 'Appropriate Level of API Access') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The operation requires Twitter Api to be either Basic or Pro.');
        }
        else if (error.errors && error.error?.errors[0].message.includes('must be ')) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.error.errors[0].message);
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function twitterApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.max_results = 10;
    do {
        responseData = await twitterApiRequest.call(this, method, endpoint, body, query, true);
        query.next_token = responseData.meta.next_token;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.meta.next_token);
    return returnData;
}
function returnId(tweetId) {
    if (tweetId.mode === 'id') {
        return tweetId.value;
    }
    else if (tweetId.mode === 'url') {
        try {
            const url = new URL(tweetId.value);
            if (!/(twitter|x).com$/.test(url.hostname)) {
                throw new n8n_workflow_1.ApplicationError('Invalid domain');
            }
            const parts = url.pathname.split('/');
            if (parts.length !== 4 || parts[2] !== 'status' || !/^\d+$/.test(parts[3])) {
                throw new n8n_workflow_1.ApplicationError('Invalid path');
            }
            return parts[3];
        }
        catch (error) {
            throw new n8n_workflow_1.ApplicationError('Not a valid tweet url', { level: 'warning', cause: error });
        }
    }
    else {
        throw new n8n_workflow_1.ApplicationError(`The mode ${tweetId.mode} is not valid!`, { level: 'warning' });
    }
}
async function returnIdFromUsername(usernameRlc) {
    usernameRlc.value = usernameRlc.value.includes('@')
        ? usernameRlc.value.replace('@', '')
        : usernameRlc.value;
    if (usernameRlc.mode === 'username' ||
        (usernameRlc.mode === 'name' && this.getNode().parameters.list !== undefined)) {
        const user = (await twitterApiRequest.call(this, 'GET', `/users/by/username/${usernameRlc.value}`, {}));
        return user.id;
    }
    else if (this.getNode().parameters.list === undefined) {
        const list = (await twitterApiRequest.call(this, 'GET', `/list/by/name/${usernameRlc.value}`, {}));
        return list.id;
    }
    else
        throw new n8n_workflow_1.ApplicationError(`The username mode ${usernameRlc.mode} is not valid!`, {
            level: 'warning',
        });
}
//# sourceMappingURL=GenericFunctions.js.map
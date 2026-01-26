"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = getUserInfo;
exports.getChannelInfo = getChannelInfo;
exports.downloadFile = downloadFile;
exports.verifySignature = verifySignature;
const n8n_workflow_1 = require("n8n-workflow");
const crypto_1 = require("crypto");
const GenericFunctions_1 = require("./V2/GenericFunctions");
async function getUserInfo(userId) {
    const user = await GenericFunctions_1.slackApiRequest.call(this, 'GET', '/users.info', {}, {
        user: userId,
    });
    return user.user.name;
}
async function getChannelInfo(channelId) {
    const channel = await GenericFunctions_1.slackApiRequest.call(this, 'GET', '/conversations.info', {}, {
        channel: channelId,
    });
    return channel.channel.name;
}
async function downloadFile(url) {
    let options = {
        method: 'GET',
        url,
    };
    const requestOptions = {
        encoding: 'arraybuffer',
        returnFullResponse: true,
        json: false,
        useStream: true,
    };
    options = Object.assign({}, options, requestOptions);
    const response = await this.helpers.requestWithAuthentication.call(this, 'slackApi', options);
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
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Slack error response: ' + JSON.stringify(response.error));
    }
    return response;
}
async function verifySignature() {
    const credential = await this.getCredentials('slackApi');
    if (!credential?.signatureSecret) {
        return true; // No signature secret provided, skip verification
    }
    const req = this.getRequestObject();
    const signature = req.header('x-slack-signature');
    const timestamp = req.header('x-slack-request-timestamp');
    if (!signature || !timestamp) {
        return false;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const timestampNum = parseInt(timestamp, 10);
    if (isNaN(timestampNum) || Math.abs(currentTime - timestampNum) > 60 * 5) {
        return false;
    }
    try {
        if (typeof credential.signatureSecret !== 'string') {
            return false;
        }
        if (!req.rawBody) {
            return false;
        }
        const hmac = (0, crypto_1.createHmac)('sha256', credential.signatureSecret);
        if (Buffer.isBuffer(req.rawBody)) {
            hmac.update(`v0:${timestamp}:`);
            hmac.update(req.rawBody);
        }
        else {
            const rawBodyString = typeof req.rawBody === 'string' ? req.rawBody : JSON.stringify(req.rawBody);
            hmac.update(`v0:${timestamp}:${rawBodyString}`);
        }
        const computedSignature = `v0=${hmac.digest('hex')}`;
        const computedBuffer = Buffer.from(computedSignature);
        const providedBuffer = Buffer.from(signature);
        return (computedBuffer.length === providedBuffer.length &&
            (0, crypto_1.timingSafeEqual)(computedBuffer, providedBuffer));
    }
    catch (error) {
        return false;
    }
}
//# sourceMappingURL=SlackTriggerHelpers.js.map
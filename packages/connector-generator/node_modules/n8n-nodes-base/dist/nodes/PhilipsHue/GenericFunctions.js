"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.philipsHueApiRequest = philipsHueApiRequest;
exports.getUser = getUser;
const n8n_workflow_1 = require("n8n-workflow");
async function philipsHueApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `https://api.meethue.com/route${resource}`,
        json: true,
    };
    try {
        if (Object.keys(headers).length !== 0) {
            options.headers = Object.assign({}, options.headers, headers);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(qs).length === 0) {
            delete options.qs;
        }
        const response = await this.helpers.requestOAuth2.call(this, 'philipsHueOAuth2Api', options, {
            tokenType: 'Bearer',
        });
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function getUser() {
    const { whitelist } = await philipsHueApiRequest.call(this, 'GET', '/api/0/config', {}, {});
    //check if there is a n8n user
    for (const user of Object.keys(whitelist)) {
        if (whitelist[user].name === 'n8n') {
            return user;
        }
    }
    // n8n user was not fount then create the user
    await philipsHueApiRequest.call(this, 'PUT', '/api/0/config', { linkbutton: true });
    const { success } = await philipsHueApiRequest.call(this, 'POST', '/api', { devicetype: 'n8n' });
    return success.username;
}
//# sourceMappingURL=GenericFunctions.js.map
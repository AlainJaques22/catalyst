"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sms77ApiRequest = sms77ApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to seven
 *
 * @param {IHookFunctions | IExecuteFunctions} this
 * @param {object | undefined} data
 */
async function sms77ApiRequest(method, endpoint, body, qs = {}) {
    const options = {
        headers: {
            SentWith: 'n8n',
        },
        qs,
        uri: `https://gateway.seven.io/api${endpoint}`,
        json: true,
        method,
    };
    if (Object.keys(body).length) {
        options.form = body;
    }
    const response = await this.helpers.requestWithAuthentication.call(this, 'sms77Api', options);
    if (response.success !== '100') {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
            message: 'Invalid sms77 credentials or API error!',
        });
    }
    return response;
}
//# sourceMappingURL=GenericFunctions.js.map
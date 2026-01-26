"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plivoApiRequest = plivoApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Plivo.
 *
 */
async function plivoApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('plivoApi');
    const options = {
        headers: {
            'user-agent': 'plivo-n8n',
        },
        method,
        form: body,
        qs,
        uri: `https://api.plivo.com/v1/Account/${credentials.authId}${endpoint}/`,
        auth: {
            user: credentials.authId,
            pass: credentials.authToken,
        },
        json: true,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
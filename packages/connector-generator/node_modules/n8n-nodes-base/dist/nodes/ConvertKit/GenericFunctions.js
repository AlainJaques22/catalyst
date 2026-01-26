"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKitApiRequest = convertKitApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function convertKitApiRequest(method, endpoint, body = {}, qs = {}, url, option = {}) {
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        qs,
        body,
        url: url || `https://api.convertkit.com/v3${endpoint}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    if (Object.keys(options.qs).length === 0) {
        delete options.qs;
    }
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'convertKitApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
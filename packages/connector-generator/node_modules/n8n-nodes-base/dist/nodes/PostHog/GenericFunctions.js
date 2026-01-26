"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posthogApiRequest = posthogApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function posthogApiRequest(method, path, body = {}, qs = {}, _option = {}) {
    const credentials = await this.getCredentials('postHogApi');
    const base = credentials.url;
    body.api_key = credentials.apiKey;
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        url: `${base}${path}`,
        json: true,
    };
    try {
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
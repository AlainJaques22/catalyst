"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uprocApiRequest = uprocApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function uprocApiRequest(method, body = {}, qs = {}, _option = {}) {
    const options = {
        method,
        qs,
        body,
        url: 'https://api.uproc.io/api/v2/process',
        json: true,
    };
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'uprocApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
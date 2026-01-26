"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ouraApiRequest = ouraApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function ouraApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    let options = {
        method,
        qs,
        body,
        url: uri ?? `https://api.ouraring.com/v2${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    options = Object.assign({}, options, option);
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'ouraApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
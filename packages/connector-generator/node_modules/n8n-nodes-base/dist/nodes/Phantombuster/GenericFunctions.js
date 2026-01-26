"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phantombusterApiRequest = phantombusterApiRequest;
exports.validateJSON = validateJSON;
const n8n_workflow_1 = require("n8n-workflow");
async function phantombusterApiRequest(method, path, body = {}, qs = {}, _option = {}) {
    const options = {
        headers: {},
        method,
        body,
        qs,
        uri: `https://api.phantombuster.com/api/v2${path}`,
        json: true,
    };
    try {
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.requestWithAuthentication.call(this, 'phantombusterApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function validateJSON(self, json, name) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        throw new n8n_workflow_1.NodeOperationError(self.getNode(), `${name} must provide a valid JSON`);
    }
    return result;
}
//# sourceMappingURL=GenericFunctions.js.map
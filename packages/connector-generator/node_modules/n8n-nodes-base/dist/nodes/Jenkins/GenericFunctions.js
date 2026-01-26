"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tolerateTrailingSlash = tolerateTrailingSlash;
exports.jenkinsApiRequest = jenkinsApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
function tolerateTrailingSlash(baseUrl) {
    return baseUrl.endsWith('/') ? baseUrl.substr(0, baseUrl.length - 1) : baseUrl;
}
async function jenkinsApiRequest(method, uri, qs = {}, body = '', option = {}) {
    const credentials = await this.getCredentials('jenkinsApi');
    let options = {
        headers: {
            Accept: 'application/json',
        },
        method,
        auth: {
            username: credentials.username,
            password: credentials.apiKey,
        },
        uri: `${tolerateTrailingSlash(credentials.baseUrl)}${uri}`,
        json: true,
        qs,
        body,
    };
    options = Object.assign({}, options, option);
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
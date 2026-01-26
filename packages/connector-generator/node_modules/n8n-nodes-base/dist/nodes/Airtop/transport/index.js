"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
const constants_1 = require("../constants");
const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-airtop-sdk-environment': 'n8n',
    'x-airtop-sdk-version': constants_1.N8N_VERSION,
};
async function apiRequest(method, endpoint, body = {}, query = {}) {
    const options = {
        headers: defaultHeaders,
        method,
        body,
        qs: query,
        url: endpoint.startsWith('http') ? endpoint : `${constants_1.BASE_URL}${endpoint}`,
        json: true,
    };
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    return await this.helpers.httpRequestWithAuthentication.call(this, 'airtopApi', options);
}
//# sourceMappingURL=index.js.map
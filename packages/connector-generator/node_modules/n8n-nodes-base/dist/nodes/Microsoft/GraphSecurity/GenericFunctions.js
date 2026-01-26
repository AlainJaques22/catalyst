"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msGraphSecurityApiRequest = msGraphSecurityApiRequest;
exports.tolerateDoubleQuotes = tolerateDoubleQuotes;
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
const n8n_workflow_1 = require("n8n-workflow");
async function msGraphSecurityApiRequest(method, endpoint, body = {}, qs = {}, headers = {}) {
    const { oauthTokenData: { access_token }, } = await this.getCredentials('microsoftGraphSecurityOAuth2Api');
    const options = {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        method,
        body,
        qs,
        uri: `https://graph.microsoft.com/v1.0/security${endpoint}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    if (Object.keys(headers).length) {
        options.headers = { ...options.headers, ...headers };
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        const nestedMessage = error?.error?.error?.message;
        if (nestedMessage.startsWith('{"')) {
            error = JSON.parse(nestedMessage);
        }
        if (nestedMessage.startsWith('Http request failed with statusCode=BadRequest')) {
            error.error.error.message = 'Request failed with bad request';
        }
        else if (nestedMessage.startsWith('Http request failed with')) {
            const stringified = nestedMessage.split(': ').pop();
            if (stringified) {
                error = JSON.parse(stringified);
            }
        }
        if (['Invalid filter clause', 'Invalid ODATA query filter'].includes(nestedMessage)) {
            error.error.error.message +=
                ' - Please check that your query parameter syntax is correct: https://docs.microsoft.com/en-us/graph/query-parameters#filter-parameter';
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function tolerateDoubleQuotes(filterQueryParameter) {
    return filterQueryParameter.replace(/"/g, "'");
}
function throwOnEmptyUpdate() {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one field to update');
}
//# sourceMappingURL=GenericFunctions.js.map
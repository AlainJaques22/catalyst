"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
exports.apiRequestAllItems = apiRequestAllItems;
exports.validateCredentials = validateCredentials;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Mattermost
 */
async function apiRequest(method, endpoint, body = {}, query = {}) {
    const credentials = await this.getCredentials('syncroMspApi');
    query.api_key = credentials.apiKey;
    const options = {
        method,
        body,
        qs: query,
        url: `https://${credentials.subdomain}.syncromsp.com/api/v1/${endpoint}`,
        headers: {},
    };
    try {
        return await this.helpers.httpRequest(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function apiRequestAllItems(method, endpoint, body = {}, query = {}) {
    let returnData = [];
    let responseData;
    query.page = 1;
    do {
        responseData = await apiRequest.call(this, method, endpoint, body, query);
        query.page++;
        returnData = returnData.concat(responseData[endpoint]);
    } while (responseData[endpoint].length !== 0);
    return returnData;
}
async function validateCredentials(decryptedCredentials) {
    const credentials = decryptedCredentials;
    const { subdomain, apiKey } = credentials;
    const options = {
        method: 'GET',
        qs: {
            api_key: apiKey,
        },
        url: `https://${subdomain}.syncromsp.com/api/v1//me`,
    };
    return await this.helpers.request(options);
}
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bubbleApiRequest = bubbleApiRequest;
exports.bubbleApiRequestAllItems = bubbleApiRequestAllItems;
exports.validateJSON = validateJSON;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated API request to Bubble.
 */
async function bubbleApiRequest(method, endpoint, body, qs) {
    const { apiToken, appName, domain, environment, hosting } = await this.getCredentials('bubbleApi');
    const rootUrl = hosting === 'bubbleHosted' ? `https://${appName}.bubbleapps.io` : domain;
    const urlSegment = environment === 'development' ? '/version-test/api/1.1' : '/api/1.1';
    const options = {
        headers: {
            'user-agent': 'n8n',
            Authorization: `Bearer ${apiToken}`,
        },
        method,
        uri: `${rootUrl}${urlSegment}${endpoint}`,
        qs,
        body,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an authenticated API request to Bubble and return all results.
 */
async function bubbleApiRequestAllItems(method, endpoint, body, qs) {
    const returnData = [];
    let responseData;
    qs.limit = 100;
    qs.cursor = 0;
    do {
        responseData = await bubbleApiRequest.call(this, method, endpoint, body, qs);
        qs.cursor += qs.limit;
        returnData.push.apply(returnData, responseData.response.results);
    } while (responseData.response.remaining !== 0);
    return returnData;
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
//# sourceMappingURL=GenericFunctions.js.map
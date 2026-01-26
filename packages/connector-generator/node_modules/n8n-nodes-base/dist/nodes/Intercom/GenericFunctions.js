"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intercomApiRequest = intercomApiRequest;
exports.intercomApiRequestAllItems = intercomApiRequestAllItems;
exports.validateJSON = validateJSON;
const n8n_workflow_1 = require("n8n-workflow");
async function intercomApiRequest(endpoint, method, body = {}, query, uri) {
    const options = {
        method,
        qs: query,
        url: uri ?? `https://api.intercom.io${endpoint}`,
        body,
        json: true,
    };
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'intercomApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an API request to paginated intercom endpoint
 * and return all results
 */
async function intercomApiRequestAllItems(propertyName, endpoint, method, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.per_page = 60;
    let uri;
    do {
        responseData = await intercomApiRequest.call(this, endpoint, method, body, query, uri);
        uri = responseData.pages.next;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.pages?.next !== null);
    return returnData;
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = '';
    }
    return result;
}
//# sourceMappingURL=GenericFunctions.js.map
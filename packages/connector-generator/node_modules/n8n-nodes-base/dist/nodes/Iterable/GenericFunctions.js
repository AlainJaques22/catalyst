"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterableApiRequest = iterableApiRequest;
exports.iterableApiRequestAllItems = iterableApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function iterableApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    const credentials = await this.getCredentials('iterableApi');
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        url: uri || `${credentials.region}/api${resource}`,
        json: true,
    };
    try {
        if (Object.keys(headers).length !== 0) {
            options.headers = Object.assign({}, options.headers, headers);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.httpRequestWithAuthentication.call(this, 'iterableApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function iterableApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.maxResults = 100;
    do {
        responseData = await iterableApiRequest.call(this, method, endpoint, body, query);
        query.pageToken = responseData.nextPageToken;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.nextPageToken !== undefined && responseData.nextPageToken !== '');
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codaApiRequest = codaApiRequest;
exports.codaApiRequestAllItems = codaApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function codaApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    const credentials = await this.getCredentials('codaApi');
    let options = {
        headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            'User-Agent': 'n8n',
        },
        method,
        qs,
        body,
        uri: uri || `https://coda.io/apis/v1${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an API request to paginated coda endpoint
 * and return all results
 */
async function codaApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.limit = 100;
    let uri;
    do {
        responseData = await codaApiRequest.call(this, method, resource, body, query, uri);
        uri = responseData.nextPageLink;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.nextPageLink !== undefined && responseData.nextPageLink !== '');
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
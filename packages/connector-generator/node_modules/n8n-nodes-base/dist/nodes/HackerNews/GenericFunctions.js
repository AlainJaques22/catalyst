"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hackerNewsApiRequest = hackerNewsApiRequest;
exports.hackerNewsApiRequestAllItems = hackerNewsApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to HackerNews
 *
 */
async function hackerNewsApiRequest(method, endpoint, qs) {
    const options = {
        method,
        qs,
        uri: `http://hn.algolia.com/api/v1/${endpoint}`,
        json: true,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an API request to HackerNews
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
async function hackerNewsApiRequestAllItems(method, endpoint, qs) {
    qs.hitsPerPage = 100;
    const returnData = [];
    let responseData;
    let itemsReceived = 0;
    do {
        responseData = await hackerNewsApiRequest.call(this, method, endpoint, qs);
        returnData.push.apply(returnData, responseData.hits);
        if (returnData !== undefined) {
            itemsReceived += returnData.length;
        }
    } while (responseData.nbHits > itemsReceived);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
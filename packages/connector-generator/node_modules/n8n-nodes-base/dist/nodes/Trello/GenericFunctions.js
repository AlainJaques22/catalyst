"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
exports.apiRequestAllItems = apiRequestAllItems;
/**
 * Make an API request to Trello
 *
 */
async function apiRequest(method, endpoint, body, query) {
    query = query || {};
    const options = {
        method,
        body,
        qs: query,
        uri: `https://api.trello.com/1/${endpoint}`,
        json: true,
    };
    if (method === 'GET') {
        delete options.body;
    }
    return await this.helpers.requestWithAuthentication.call(this, 'trelloApi', options);
}
async function apiRequestAllItems(method, endpoint, body, query = {}) {
    query.limit = 30;
    query.sort = '-id';
    const returnData = [];
    let responseData;
    do {
        responseData = await apiRequest.call(this, method, endpoint, body, query);
        returnData.push.apply(returnData, responseData);
        if (responseData.length !== 0) {
            query.before = responseData[responseData.length - 1].id;
        }
    } while (query.limit <= responseData.length);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
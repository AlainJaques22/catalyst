"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
exports.apiRequestAllItems = apiRequestAllItems;
exports.getForms = getForms;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Typeform
 *
 */
async function apiRequest(method, endpoint, body, query) {
    const authenticationMethod = this.getNodeParameter('authentication', 0);
    const options = {
        headers: {},
        method,
        body,
        qs: query,
        uri: `https://api.typeform.com/${endpoint}`,
        json: true,
    };
    query = query || {};
    try {
        if (authenticationMethod === 'accessToken') {
            return await this.helpers.requestWithAuthentication.call(this, 'typeformApi', options);
        }
        else {
            return await this.helpers.requestOAuth2.call(this, 'typeformOAuth2Api', options);
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an API request to paginated Typeform endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
async function apiRequestAllItems(method, endpoint, body, query, _dataKey) {
    if (query === undefined) {
        query = {};
    }
    query.page_size = 200;
    query.page = 0;
    const returnData = {
        items: [],
    };
    let responseData;
    do {
        query.page += 1;
        responseData = await apiRequest.call(this, method, endpoint, body, query);
        returnData.items.push.apply(returnData.items, responseData.items);
    } while (responseData.page_count !== undefined && responseData.page_count > query.page);
    return returnData;
}
/**
 * Returns all the available forms
 *
 */
async function getForms() {
    const endpoint = 'forms';
    const responseData = await apiRequestAllItems.call(this, 'GET', endpoint, {});
    if (responseData.items === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const returnData = [];
    for (const baseData of responseData.items) {
        returnData.push({
            name: baseData.title,
            value: baseData.id,
        });
    }
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keapApiRequest = keapApiRequest;
exports.keapApiRequestAllItems = keapApiRequestAllItems;
exports.keysToSnakeCase = keysToSnakeCase;
const change_case_1 = require("change-case");
const n8n_workflow_1 = require("n8n-workflow");
async function keapApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}, option = {}) {
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `https://api.infusionsoft.com/crm/rest/v1${resource}`,
        json: true,
    };
    try {
        options = Object.assign({}, options, option);
        if (Object.keys(headers).length !== 0) {
            options.headers = Object.assign({}, options.headers, headers);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.requestOAuth2.call(this, 'keapOAuth2Api', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function keapApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    query.limit = 50;
    do {
        responseData = await keapApiRequest.call(this, method, endpoint, body, query, uri);
        uri = responseData.next;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (returnData.length < responseData.count);
    return returnData;
}
function keysToSnakeCase(elements) {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    for (const element of elements) {
        for (const key of Object.keys(element)) {
            if (key !== (0, change_case_1.snakeCase)(key)) {
                element[(0, change_case_1.snakeCase)(key)] = element[key];
                delete element[key];
            }
        }
    }
    return elements;
}
//# sourceMappingURL=GenericFunctions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getresponseApiRequest = getresponseApiRequest;
exports.getResponseApiRequestAllItems = getResponseApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function getresponseApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    const authentication = this.getNodeParameter('authentication', 0, 'apiKey');
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `https://api.getresponse.com/v3${resource}`,
        json: true,
    };
    try {
        options = Object.assign({}, options, option);
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (authentication === 'apiKey') {
            return await this.helpers.requestWithAuthentication.call(this, 'getResponseApi', options);
        }
        else {
            return await this.helpers.requestOAuth2.call(this, 'getResponseOAuth2Api', options);
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function getResponseApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.page = 1;
    do {
        responseData = await getresponseApiRequest.call(this, method, endpoint, body, query, undefined, { resolveWithFullResponse: true });
        query.page++;
        returnData.push.apply(returnData, responseData.body);
    } while (responseData.headers.TotalPages !== responseData.headers.CurrentPage);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
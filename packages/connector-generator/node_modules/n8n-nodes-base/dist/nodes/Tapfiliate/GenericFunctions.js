"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapfiliateApiRequest = tapfiliateApiRequest;
exports.tapfiliateApiRequestAllItems = tapfiliateApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function tapfiliateApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    const credentials = await this.getCredentials('tapfiliateApi');
    const options = {
        headers: {
            'Api-Key': credentials.apiKey,
        },
        method,
        qs,
        body,
        uri: uri || `https://api.tapfiliate.com/1.6${endpoint}`,
        json: true,
    };
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    if (Object.keys(option).length !== 0) {
        Object.assign(options, option);
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function tapfiliateApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.page = 1;
    do {
        responseData = await tapfiliateApiRequest.call(this, method, endpoint, body, query, '', {
            resolveWithFullResponse: true,
        });
        returnData.push.apply(returnData, responseData.body);
        query.page++;
    } while (responseData.headers.link.includes('next'));
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
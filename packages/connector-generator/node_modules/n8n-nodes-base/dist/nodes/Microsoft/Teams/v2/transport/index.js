"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microsoftApiRequest = microsoftApiRequest;
exports.microsoftApiRequestAllItems = microsoftApiRequestAllItems;
exports.microsoftApiRequestAllItemsSkip = microsoftApiRequestAllItemsSkip;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../utils/utilities");
async function microsoftApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `https://graph.microsoft.com${resource}`,
        json: true,
    };
    try {
        if (Object.keys(headers).length !== 0) {
            options.headers = Object.assign({}, options.headers, headers);
        }
        return await this.helpers.requestOAuth2.call(this, 'microsoftTeamsOAuth2Api', options);
    }
    catch (error) {
        const errorOptions = {};
        if (error.error?.error) {
            const httpCode = error.statusCode;
            error = error.error.error;
            error.statusCode = httpCode;
            errorOptions.message = error.message;
            if (error.code === 'NotFound' && error.message === 'Resource not found') {
                const nodeResource = (0, utilities_1.capitalize)(this.getNodeParameter('resource', 0));
                errorOptions.message = `${nodeResource} not found`;
            }
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, errorOptions);
    }
}
async function microsoftApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    do {
        responseData = await microsoftApiRequest.call(this, method, endpoint, body, query, uri);
        uri = responseData['@odata.nextLink'];
        returnData.push.apply(returnData, responseData[propertyName]);
        const limit = query.limit;
        if (limit && limit <= returnData.length) {
            return returnData;
        }
    } while (responseData['@odata.nextLink'] !== undefined);
    return returnData;
}
async function microsoftApiRequestAllItemsSkip(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.$top = 100;
    query.$skip = 0;
    do {
        responseData = await microsoftApiRequest.call(this, method, endpoint, body, query);
        query.$skip += query.$top;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.value.length !== 0);
    return returnData;
}
//# sourceMappingURL=index.js.map
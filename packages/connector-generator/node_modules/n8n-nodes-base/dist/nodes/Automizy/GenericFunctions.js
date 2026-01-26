"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automizyApiRequest = automizyApiRequest;
exports.automizyApiRequestAllItems = automizyApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function automizyApiRequest(method, path, body = {}, qs = {}, option = {}) {
    const credentials = await this.getCredentials('automizyApi');
    const options = {
        headers: {
            Authorization: `Bearer ${credentials.apiToken}`,
        },
        method,
        body,
        qs,
        uri: `https://gateway.automizy.com/v2${path}`,
        json: true,
    };
    try {
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(qs).length === 0) {
            delete options.qs;
        }
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        return await this.helpers.request.call(this, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function automizyApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.limit = 100;
    query.page = 1;
    do {
        responseData = await automizyApiRequest.call(this, method, endpoint, body, query);
        query.page++;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.pageCount !== responseData.page);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
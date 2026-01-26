"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autopilotApiRequest = autopilotApiRequest;
exports.autopilotApiRequestAllItems = autopilotApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function autopilotApiRequest(method, resource, body = {}, query = {}, uri, _option = {}) {
    const credentials = await this.getCredentials('autopilotApi');
    const endpoint = 'https://api2.autopilothq.com/v1';
    const options = {
        headers: {
            'Content-Type': 'application/json',
            autopilotapikey: credentials.apiKey,
        },
        method,
        body,
        qs: query,
        uri: uri || `${endpoint}${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(query).length) {
        delete options.qs;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function autopilotApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    const returnAll = this.getNodeParameter('returnAll', 0, false);
    const base = endpoint;
    let responseData;
    do {
        responseData = await autopilotApiRequest.call(this, method, endpoint, body, query);
        endpoint = `${base}/${responseData.bookmark}`;
        returnData.push.apply(returnData, responseData[propertyName]);
        const limit = query.limit;
        if (limit && returnData.length >= limit && !returnAll) {
            return returnData;
        }
    } while (responseData.bookmark !== undefined);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
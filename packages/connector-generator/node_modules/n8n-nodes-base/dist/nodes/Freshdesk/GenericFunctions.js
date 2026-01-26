"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freshdeskApiRequest = freshdeskApiRequest;
exports.freshdeskApiRequestAllItems = freshdeskApiRequestAllItems;
exports.validateJSON = validateJSON;
exports.capitalize = capitalize;
const n8n_workflow_1 = require("n8n-workflow");
async function freshdeskApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    const credentials = await this.getCredentials('freshdeskApi');
    const apiKey = `${credentials.apiKey}:X`;
    const endpoint = 'freshdesk.com/api/v2';
    let options = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${Buffer.from(apiKey).toString(n8n_workflow_1.BINARY_ENCODING)}`,
        },
        method,
        body,
        qs: query,
        uri: uri || `https://${credentials.domain}.${endpoint}${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(query).length) {
        delete options.qs;
    }
    options = Object.assign({}, options, option);
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function freshdeskApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    query.per_page = 100;
    do {
        responseData = await freshdeskApiRequest.call(this, method, endpoint, body, query, uri, {
            resolveWithFullResponse: true,
        });
        if (responseData.headers.link) {
            uri = responseData.headers.link.split(';')[0].replace('<', '').replace('>', '');
        }
        returnData.push.apply(returnData, responseData.body);
    } while (responseData.headers.link?.includes('rel="next"'));
    return returnData;
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = [];
    }
    return result;
}
function capitalize(s) {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}
//# sourceMappingURL=GenericFunctions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerbearApiRequest = bannerbearApiRequest;
exports.keysToSnakeCase = keysToSnakeCase;
const change_case_1 = require("change-case");
const n8n_workflow_1 = require("n8n-workflow");
async function bannerbearApiRequest(method, resource, body = {}, query = {}, uri, headers = {}) {
    const credentials = await this.getCredentials('bannerbearApi');
    const options = {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${credentials.apiKey}`,
        },
        method,
        body,
        qs: query,
        uri: uri || `https://api.bannerbear.com/v2${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.form;
    }
    if (!Object.keys(query).length) {
        delete options.qs;
    }
    options.headers = Object.assign({}, options.headers, headers);
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
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
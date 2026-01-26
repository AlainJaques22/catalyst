"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calApiRequest = calApiRequest;
exports.sortOptionParameters = sortOptionParameters;
const n8n_workflow_1 = require("n8n-workflow");
async function calApiRequest(method, resource, body = {}, query = {}, option = {}) {
    const credentials = await this.getCredentials('calApi');
    let options = {
        baseURL: credentials.host,
        method,
        body,
        qs: query,
        url: resource,
    };
    if (!Object.keys(query).length) {
        delete options.qs;
    }
    options = Object.assign({}, options, option);
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'calApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function sortOptionParameters(optionParameters) {
    optionParameters.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName < bName) {
            return -1;
        }
        if (aName > bName) {
            return 1;
        }
        return 0;
    });
    return optionParameters;
}
//# sourceMappingURL=GenericFunctions.js.map
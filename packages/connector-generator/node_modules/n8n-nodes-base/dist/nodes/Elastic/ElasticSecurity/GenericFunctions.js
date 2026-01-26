"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tolerateTrailingSlash = tolerateTrailingSlash;
exports.elasticSecurityApiRequest = elasticSecurityApiRequest;
exports.elasticSecurityApiRequestAllItems = elasticSecurityApiRequestAllItems;
exports.handleListing = handleListing;
exports.getConnector = getConnector;
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
exports.getVersion = getVersion;
const n8n_workflow_1 = require("n8n-workflow");
function tolerateTrailingSlash(baseUrl) {
    return baseUrl.endsWith('/') ? baseUrl.substr(0, baseUrl.length - 1) : baseUrl;
}
async function elasticSecurityApiRequest(method, endpoint, body = {}, qs = {}) {
    const { baseUrl: rawBaseUrl } = await this.getCredentials('elasticSecurityApi');
    const baseUrl = tolerateTrailingSlash(rawBaseUrl);
    const options = {
        method,
        body,
        qs,
        uri: `${baseUrl}/api${endpoint}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    try {
        return await this.helpers.requestWithAuthentication.call(this, 'elasticSecurityApi', options);
    }
    catch (error) {
        if (error?.error?.error === 'Not Acceptable' && error?.error?.message) {
            error.error.error = `${error.error.error}: ${error.error.message}`;
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function elasticSecurityApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    let _page = 1;
    const returnData = [];
    let responseData;
    const resource = this.getNodeParameter('resource', 0);
    do {
        responseData = await elasticSecurityApiRequest.call(this, method, endpoint, body, qs);
        _page++;
        const items = resource === 'case' ? responseData.cases : responseData;
        returnData.push(...items);
    } while (returnData.length < responseData.total);
    return returnData;
}
async function handleListing(method, endpoint, body = {}, qs = {}) {
    const returnAll = this.getNodeParameter('returnAll', 0);
    if (returnAll) {
        return await elasticSecurityApiRequestAllItems.call(this, method, endpoint, body, qs);
    }
    const responseData = await elasticSecurityApiRequestAllItems.call(this, method, endpoint, body, qs);
    const limit = this.getNodeParameter('limit', 0);
    return responseData.slice(0, limit);
}
/**
 * Retrieve a connector name and type from a connector ID.
 *
 * https://www.elastic.co/guide/en/kibana/master/get-connector-api.html
 */
async function getConnector(connectorId) {
    const endpoint = `/actions/connector/${connectorId}`;
    const { id, name, connector_type_id: type, } = (await elasticSecurityApiRequest.call(this, 'GET', endpoint));
    return { id, name, type };
}
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}`);
}
async function getVersion(endpoint) {
    const { version } = (await elasticSecurityApiRequest.call(this, 'GET', endpoint));
    if (!version) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Cannot retrieve version for resource');
    }
    return version;
}
//# sourceMappingURL=GenericFunctions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOptions = void 0;
exports.getAuthorization = getAuthorization;
exports.taigaApiRequest = taigaApiRequest;
exports.taigaApiRequestAllItems = taigaApiRequestAllItems;
exports.getAutomaticSecret = getAutomaticSecret;
exports.handleListing = handleListing;
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
exports.getVersionForUpdate = getVersionForUpdate;
const crypto_1 = require("crypto");
const n8n_workflow_1 = require("n8n-workflow");
async function getAuthorization(credentials) {
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
    }
    const { password, username } = credentials;
    const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: {
            type: 'normal',
            password,
            username,
        },
        uri: credentials.url ? `${credentials.url}/api/v1/auth` : 'https://api.taiga.io/api/v1/auth',
        json: true,
    };
    try {
        const response = await this.helpers.request(options);
        return response.auth_token;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function taigaApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    const credentials = await this.getCredentials('taigaApi');
    const authToken = await getAuthorization.call(this, credentials);
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            bearer: authToken,
        },
        qs: query,
        method,
        body,
        uri: uri || credentials.url
            ? `${credentials.url}/api/v1${resource}`
            : `https://api.taiga.io/api/v1${resource}`,
        json: true,
    };
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
async function taigaApiRequestAllItems(method, resource, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    do {
        responseData = await taigaApiRequest.call(this, method, resource, body, query, uri, {
            resolveWithFullResponse: true,
        });
        returnData.push.apply(returnData, responseData.body);
        uri = responseData.headers['x-pagination-next'];
        const limit = query.limit;
        if (limit && returnData.length >= limit) {
            return returnData;
        }
    } while (responseData.headers['x-pagination-next'] !== undefined &&
        responseData.headers['x-pagination-next'] !== '');
    return returnData;
}
function getAutomaticSecret(credentials) {
    const data = `${credentials.username},${credentials.password}`;
    return (0, crypto_1.createHash)('md5').update(data).digest('hex');
}
async function handleListing(method, endpoint, body, qs, i) {
    let responseData;
    qs.project = this.getNodeParameter('projectId', i);
    const returnAll = this.getNodeParameter('returnAll', i);
    if (returnAll) {
        return await taigaApiRequestAllItems.call(this, method, endpoint, body, qs);
    }
    else {
        qs.limit = this.getNodeParameter('limit', i);
        responseData = await taigaApiRequestAllItems.call(this, method, endpoint, body, qs);
        return responseData.splice(0, qs.limit);
    }
}
const toOptions = (items) => items.map(({ name, id }) => ({ name, value: id }));
exports.toOptions = toOptions;
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
}
async function getVersionForUpdate(endpoint) {
    return await taigaApiRequest.call(this, 'GET', endpoint).then((response) => response.version);
}
//# sourceMappingURL=GenericFunctions.js.map
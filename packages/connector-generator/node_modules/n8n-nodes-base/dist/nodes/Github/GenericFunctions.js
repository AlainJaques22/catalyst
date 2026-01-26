"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubApiRequest = githubApiRequest;
exports.getFileSha = getFileSha;
exports.githubApiRequestAllItems = githubApiRequestAllItems;
exports.isBase64 = isBase64;
exports.validateJSON = validateJSON;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Github
 *
 */
async function githubApiRequest(method, endpoint, body, query, option = {}) {
    const options = {
        method,
        headers: {
            'User-Agent': 'n8n',
        },
        body,
        qs: query,
        uri: '',
        json: true,
    };
    if (Object.keys(option).length !== 0) {
        Object.assign(options, option);
    }
    try {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'accessToken');
        let credentialType = '';
        if (authenticationMethod === 'accessToken') {
            const credentials = await this.getCredentials('githubApi');
            credentialType = 'githubApi';
            const baseUrl = credentials.server || 'https://api.github.com';
            options.uri = `${baseUrl}${endpoint}`;
        }
        else {
            const credentials = await this.getCredentials('githubOAuth2Api');
            credentialType = 'githubOAuth2Api';
            const baseUrl = credentials.server || 'https://api.github.com';
            options.uri = `${baseUrl}${endpoint}`;
        }
        return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Returns the SHA of the given file
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
async function getFileSha(owner, repository, filePath, branch) {
    const query = {};
    if (branch !== undefined) {
        query.ref = branch;
    }
    const getEndpoint = `/repos/${owner}/${repository}/contents/${encodeURI(filePath)}`;
    const responseData = await githubApiRequest.call(this, 'GET', getEndpoint, {}, query);
    if (responseData.sha === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Could not get the SHA of the file.');
    }
    return responseData.sha;
}
async function githubApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.per_page = 100;
    query.page = 1;
    do {
        responseData = await githubApiRequest.call(this, method, endpoint, body, query, {
            resolveWithFullResponse: true,
        });
        query.page++;
        returnData.push.apply(returnData, responseData.body);
    } while (responseData.headers.link?.includes('next'));
    return returnData;
}
function isBase64(content) {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(content);
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
//# sourceMappingURL=GenericFunctions.js.map
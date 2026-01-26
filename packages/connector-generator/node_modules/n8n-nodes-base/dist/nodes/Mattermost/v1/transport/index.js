"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
exports.apiRequestAllItems = apiRequestAllItems;
/**
 * Make an API request to Mattermost
 */
async function apiRequest(method, endpoint, body = {}, query = {}) {
    const credentials = await this.getCredentials('mattermostApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const options = {
        method,
        body,
        qs: query,
        url: `${baseUrl}/api/v4/${endpoint}`,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        skipSslCertificateValidation: credentials.allowUnauthorizedCerts,
    };
    return await this.helpers.httpRequestWithAuthentication.call(this, 'mattermostApi', options);
}
async function apiRequestAllItems(method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.page = 0;
    query.per_page = 100;
    do {
        responseData = await apiRequest.call(this, method, endpoint, body, query);
        query.page++;
        returnData.push.apply(returnData, responseData);
    } while (responseData.length !== 0);
    return returnData;
}
//# sourceMappingURL=index.js.map
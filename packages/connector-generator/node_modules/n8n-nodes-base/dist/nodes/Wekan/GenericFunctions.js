"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
async function apiRequest(method, endpoint, body, query) {
    const credentials = await this.getCredentials('wekanApi');
    query = query || {};
    const options = {
        headers: {
            Accept: 'application/json',
        },
        method,
        body,
        qs: query,
        uri: `${credentials.url}/api/${endpoint}`,
        json: true,
    };
    return await this.helpers.requestWithAuthentication.call(this, 'wekanApi', options);
}
//# sourceMappingURL=GenericFunctions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rocketchatApiRequest = rocketchatApiRequest;
exports.validateJSON = validateJSON;
async function rocketchatApiRequest(resource, method, operation, body = {}, headers) {
    const credentials = await this.getCredentials('rocketchatApi');
    const options = {
        headers,
        method,
        body,
        uri: `${credentials.domain}/api/v1${resource}.${operation}`,
        json: true,
    };
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    return await this.helpers.requestWithAuthentication.call(this, 'rocketchatApi', options);
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
//# sourceMappingURL=GenericFunctions.js.map
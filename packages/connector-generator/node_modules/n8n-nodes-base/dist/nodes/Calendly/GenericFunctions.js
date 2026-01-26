"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticationType = getAuthenticationType;
exports.calendlyApiRequest = calendlyApiRequest;
function getAuthenticationTypeFromApiKey(data) {
    // The access token is a JWT, so it will always include dots to separate
    // header, payoload and signature.
    return data.includes('.') ? 'accessToken' : 'apiKey';
}
async function getAuthenticationType() {
    const authentication = this.getNodeParameter('authentication', 0);
    if (authentication === 'apiKey') {
        const { apiKey } = await this.getCredentials('calendlyApi');
        return getAuthenticationTypeFromApiKey(apiKey);
    }
    else {
        return 'accessToken';
    }
}
async function calendlyApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    const authenticationType = await getAuthenticationType.call(this);
    const headers = {
        'Content-Type': 'application/json',
    };
    let endpoint = 'https://api.calendly.com';
    // remove once API key is deprecated
    if (authenticationType === 'apiKey') {
        endpoint = 'https://calendly.com/api/v1';
    }
    let options = {
        headers,
        method,
        body,
        qs: query,
        uri: uri || `${endpoint}${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.form;
    }
    if (!Object.keys(query).length) {
        delete options.qs;
    }
    options = Object.assign({}, options, option);
    const credentialsType = this.getNodeParameter('authentication', 0) === 'apiKey'
        ? 'calendlyApi'
        : 'calendlyOAuth2Api';
    return await this.helpers.requestWithAuthentication.call(this, credentialsType, options);
}
//# sourceMappingURL=GenericFunctions.js.map
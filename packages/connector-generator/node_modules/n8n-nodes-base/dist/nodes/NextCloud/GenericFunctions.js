"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextCloudApiRequest = nextCloudApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to NextCloud
 *
 */
async function nextCloudApiRequest(method, endpoint, body, headers, encoding, query) {
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const authenticationMethod = this.getNodeParameter('authentication', 0);
    let credentials;
    if (authenticationMethod === 'accessToken') {
        credentials = await this.getCredentials('nextCloudApi');
    }
    else {
        credentials = await this.getCredentials('nextCloudOAuth2Api');
    }
    const options = {
        headers,
        method,
        body,
        qs: query ?? {},
        uri: '',
        json: false,
    };
    if (encoding === null) {
        options.encoding = null;
    }
    options.uri = `${credentials.webDavUrl}/${encodeURI(endpoint)}`;
    if (resource === 'user' && operation === 'create') {
        options.uri = options.uri.replace('/remote.php/webdav', '');
    }
    if (resource === 'file' && operation === 'share') {
        options.uri = options.uri.replace('/remote.php/webdav', '');
    }
    const credentialType = authenticationMethod === 'accessToken' ? 'nextCloudApi' : 'nextCloudOAuth2Api';
    const response = await this.helpers.requestWithAuthentication.call(this, credentialType, options);
    if (typeof response === 'string' && response.includes('<b>Fatal error</b>')) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), "NextCloud responded with a 'Fatal error', check description for more details", {
            description: `Server response:\n${response}`,
        });
    }
    return response;
}
//# sourceMappingURL=GenericFunctions.js.map
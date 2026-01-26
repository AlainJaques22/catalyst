"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spontitApiRequest = spontitApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function spontitApiRequest(method, resource, body = {}, qs = {}) {
    const credentials = await this.getCredentials('spontitApi');
    try {
        const options = {
            headers: {
                'X-Authorization': credentials.apiKey,
                'X-UserId': credentials.username,
            },
            method,
            body,
            qs,
            uri: `https://api.spontit.com/v3${resource}`,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers?.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
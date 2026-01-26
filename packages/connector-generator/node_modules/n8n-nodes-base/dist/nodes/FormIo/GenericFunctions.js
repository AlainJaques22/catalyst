"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formIoApiRequest = formIoApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Method will call register or list webhooks based on the passed method in the parameter
 */
async function formIoApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('formIoApi');
    const base = credentials.domain || 'https://api.form.io';
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        url: `${base}${endpoint}`,
        json: true,
    };
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'formIoApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
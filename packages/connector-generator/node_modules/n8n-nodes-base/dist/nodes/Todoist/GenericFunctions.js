"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDueDatetime = FormatDueDatetime;
exports.todoistApiRequest = todoistApiRequest;
exports.todoistSyncRequest = todoistSyncRequest;
const n8n_workflow_1 = require("n8n-workflow");
function FormatDueDatetime(isoString) {
    // Assuming that the problem with incorrect date format was caused by milliseconds
    // Replacing the last 5 characters of ISO-formatted string with just Z char
    return isoString.replace(new RegExp('.000Z$'), 'Z');
}
async function todoistApiRequest(method, resource, body = {}, qs = {}) {
    const authentication = this.getNodeParameter('authentication', 0);
    const endpoint = 'api.todoist.com/rest/v2';
    const options = {
        method,
        qs,
        uri: `https://${endpoint}${resource}`,
        json: true,
    };
    if (Object.keys(body).length !== 0) {
        options.body = body;
    }
    try {
        const credentialType = authentication === 'apiKey' ? 'todoistApi' : 'todoistOAuth2Api';
        return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function todoistSyncRequest(body = {}, qs = {}, endpoint = '/sync') {
    const authentication = this.getNodeParameter('authentication', 0, 'oAuth2');
    const options = {
        headers: {},
        method: 'POST',
        qs,
        uri: `https://api.todoist.com/sync/v9${endpoint}`,
        json: true,
    };
    if (Object.keys(body).length !== 0) {
        options.body = body;
    }
    try {
        const credentialType = authentication === 'oAuth2' ? 'todoistOAuth2Api' : 'todoistApi';
        return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
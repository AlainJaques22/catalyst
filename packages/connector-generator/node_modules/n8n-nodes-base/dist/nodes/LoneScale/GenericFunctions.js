"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lonescaleApiRequest = lonescaleApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./constants");
async function lonescaleApiRequest(method, resource, body = {}, query = {}, uri) {
    const endpoint = `${constants_1.BASE_URL}`;
    const credentials = await this.getCredentials('loneScaleApi');
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': credentials?.apiKey,
        },
        method,
        body,
        qs: query,
        uri: uri || `${endpoint}${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(query).length) {
        delete options.qs;
    }
    try {
        return await this.helpers.requestWithAuthentication.call(this, 'loneScaleApi', options);
    }
    catch (error) {
        if (error.response) {
            const errorMessage = error.response.body.message || error.response.body.description || error.message;
            throw new n8n_workflow_1.ApplicationError(`Autopilot error response [${error.statusCode}]: ${errorMessage}`, { level: 'warning' });
        }
        throw error;
    }
}
//# sourceMappingURL=GenericFunctions.js.map
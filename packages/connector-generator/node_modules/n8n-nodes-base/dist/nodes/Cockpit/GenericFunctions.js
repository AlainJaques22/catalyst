"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cockpitApiRequest = cockpitApiRequest;
exports.createDataFromParameters = createDataFromParameters;
const n8n_workflow_1 = require("n8n-workflow");
async function cockpitApiRequest(method, resource, body = {}, uri, option = {}) {
    const credentials = await this.getCredentials('cockpitApi');
    let options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method,
        qs: {
            token: credentials.accessToken,
        },
        body,
        uri: uri || `${credentials.url}/api${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function createDataFromParameters(itemIndex) {
    const dataFieldsAreJson = this.getNodeParameter('jsonDataFields', itemIndex);
    if (dataFieldsAreJson) {
        // Parameters are defined as JSON
        return (0, n8n_workflow_1.jsonParse)(this.getNodeParameter('dataFieldsJson', itemIndex, '{}'));
    }
    // Parameters are defined in UI
    const uiDataFields = this.getNodeParameter('dataFieldsUi', itemIndex, {});
    const unpacked = {};
    if (uiDataFields.field === undefined) {
        return unpacked;
    }
    for (const field of uiDataFields.field) {
        unpacked[field.name] = field.value;
    }
    return unpacked;
}
//# sourceMappingURL=GenericFunctions.js.map
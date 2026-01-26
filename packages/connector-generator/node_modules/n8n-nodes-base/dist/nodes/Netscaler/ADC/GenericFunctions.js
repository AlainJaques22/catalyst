"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.netscalerADCApiRequest = netscalerADCApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function netscalerADCApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    const { url } = await this.getCredentials('citrixAdcApi');
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `${url.replace(new RegExp('/$'), '')}/nitro/v1${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    try {
        return await this.helpers.requestWithAuthentication.call(this, 'citrixAdcApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandfetchApiRequest = brandfetchApiRequest;
exports.fetchAndPrepareBinaryData = fetchAndPrepareBinaryData;
const n8n_workflow_1 = require("n8n-workflow");
async function brandfetchApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    try {
        let options = {
            method,
            qs,
            body,
            url: uri || `https://api.brandfetch.io/v2${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (this.getNodeParameter('operation', 0) === 'logo' && options.json === false) {
            delete options.headers;
        }
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        const response = await this.helpers.requestWithAuthentication.call(this, 'brandfetchApi', options);
        if (response.statusCode && response.statusCode !== 200) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response);
        }
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function fetchAndPrepareBinaryData(imageType, imageFormat, logoFormats, domain, newItem) {
    const data = await brandfetchApiRequest.call(this, 'GET', '', {}, {}, logoFormats.src, {
        json: false,
        encoding: null,
    });
    newItem.binary[`${imageType}_${imageFormat}`] = await this.helpers.prepareBinaryData(Buffer.from(data), `${imageType}_${domain}.${imageFormat}`);
}
//# sourceMappingURL=GenericFunctions.js.map
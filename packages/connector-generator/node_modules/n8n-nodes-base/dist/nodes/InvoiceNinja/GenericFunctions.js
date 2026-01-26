"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventID = void 0;
exports.invoiceNinjaApiRequest = invoiceNinjaApiRequest;
exports.invoiceNinjaApiRequestAllItems = invoiceNinjaApiRequestAllItems;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
exports.eventID = {
    create_client: '1',
    create_invoice: '2',
    create_quote: '3',
    create_payment: '4',
    create_vendor: '5',
};
async function invoiceNinjaApiRequest(method, endpoint, body = {}, query, uri) {
    const credentials = await this.getCredentials('invoiceNinjaApi');
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
    }
    const version = this.getNodeParameter('apiVersion', 0);
    const defaultUrl = version === 'v4' ? 'https://app.invoiceninja.com' : 'https://invoicing.co';
    const baseUrl = credentials.url || defaultUrl;
    const options = {
        method,
        qs: query,
        uri: uri || `${baseUrl}/api/v1${endpoint}`,
        body,
        json: true,
    };
    try {
        return await this.helpers.requestWithAuthentication.call(this, 'invoiceNinjaApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function invoiceNinjaApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    query.per_page = 100;
    do {
        responseData = await invoiceNinjaApiRequest.call(this, method, endpoint, body, query, uri);
        const next = (0, get_1.default)(responseData, 'meta.pagination.links.next');
        if (next) {
            uri = next;
        }
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.meta?.pagination?.links?.next);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map
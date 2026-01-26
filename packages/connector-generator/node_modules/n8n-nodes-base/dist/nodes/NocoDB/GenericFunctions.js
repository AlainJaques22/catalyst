"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
exports.apiRequestAllItems = apiRequestAllItems;
exports.downloadRecordAttachments = downloadRecordAttachments;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to NocoDB
 *
 */
async function apiRequest(method, endpoint, body, query, uri, option = {}) {
    const authenticationMethod = this.getNodeParameter('authentication', 0);
    const credentials = await this.getCredentials(authenticationMethod);
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
    }
    const baseUrl = credentials.host;
    query = query || {};
    if (!uri) {
        uri = baseUrl.endsWith('/') ? `${baseUrl.slice(0, -1)}${endpoint}` : `${baseUrl}${endpoint}`;
    }
    const options = {
        method,
        body,
        qs: query,
        uri,
        json: true,
    };
    if (Object.keys(option).length !== 0) {
        Object.assign(options, option);
    }
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    return await this.helpers.requestWithAuthentication.call(this, authenticationMethod, options);
}
/**
 * Make an API request to paginated NocoDB endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
async function apiRequestAllItems(method, endpoint, body, query) {
    const version = this.getNode().typeVersion;
    if (query === undefined) {
        query = {};
    }
    query.limit = 100;
    query.offset = query?.offset ? query.offset : 0;
    const returnData = [];
    let responseData;
    do {
        responseData = await apiRequest.call(this, method, endpoint, body, query);
        version === 1
            ? returnData.push(...responseData)
            : returnData.push(...responseData.list);
        query.offset += query.limit;
    } while (version === 1 ? responseData.length !== 0 : responseData.pageInfo.isLastPage !== true);
    return returnData;
}
async function downloadRecordAttachments(records, fieldNames, pairedItem) {
    const elements = [];
    for (const record of records) {
        const element = { json: {}, binary: {} };
        if (pairedItem) {
            element.pairedItem = pairedItem;
        }
        element.json = record;
        for (const fieldName of fieldNames) {
            let attachments = record[fieldName];
            if (typeof attachments === 'string') {
                attachments = (0, n8n_workflow_1.jsonParse)(record[fieldName]);
            }
            if (record[fieldName]) {
                for (const [index, attachment] of attachments.entries()) {
                    const attachmentUrl = attachment.signedUrl || attachment.url;
                    const file = await apiRequest.call(this, 'GET', '', {}, {}, attachmentUrl, {
                        json: false,
                        encoding: null,
                    });
                    element.binary[`${fieldName}_${index}`] = await this.helpers.prepareBinaryData(Buffer.from(file), attachment.title, attachment.mimetype);
                }
            }
        }
        if (Object.keys(element.binary).length === 0) {
            delete element.binary;
        }
        elements.push(element);
    }
    return elements;
}
//# sourceMappingURL=GenericFunctions.js.map
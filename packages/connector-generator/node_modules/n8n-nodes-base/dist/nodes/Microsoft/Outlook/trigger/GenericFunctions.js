"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPollResponse = getPollResponse;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../v2/helpers/utils");
const transport_1 = require("../v2/transport");
async function getPollResponse(pollStartDate, pollEndDate) {
    let responseData;
    const qs = {};
    try {
        const filters = this.getNodeParameter('filters', {});
        const options = this.getNodeParameter('options', {});
        const output = this.getNodeParameter('output');
        if (output === 'fields') {
            const fields = this.getNodeParameter('fields');
            if (options.downloadAttachments) {
                fields.push('hasAttachments');
            }
            qs.$select = fields.join(',');
        }
        if (output === 'simple') {
            qs.$select =
                'id,conversationId,subject,bodyPreview,from,toRecipients,categories,hasAttachments';
        }
        const filterString = (0, utils_1.prepareFilterString)({ filters });
        if (filterString) {
            qs.$filter = filterString;
        }
        const endpoint = '/messages';
        if (this.getMode() !== 'manual') {
            if (qs.$filter) {
                qs.$filter = `${qs.$filter} and receivedDateTime ge ${pollStartDate} and receivedDateTime lt ${pollEndDate}`;
            }
            else {
                qs.$filter = `receivedDateTime ge ${pollStartDate} and receivedDateTime lt ${pollEndDate}`;
            }
            responseData = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', endpoint, undefined, qs);
        }
        else {
            qs.$top = 1;
            responseData = await transport_1.microsoftApiRequest.call(this, 'GET', endpoint, undefined, qs);
            responseData = responseData.value;
        }
        if (output === 'simple') {
            responseData = (0, utils_1.simplifyOutputMessages)(responseData);
        }
        let executionData = [];
        if (options.downloadAttachments) {
            const prefix = options.attachmentsPrefix || 'attachment_';
            executionData = await transport_1.downloadAttachments.call(this, responseData, prefix);
        }
        else {
            executionData = this.helpers.returnJsonArray(responseData);
        }
        return executionData;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: error.message,
            description: error.description,
        });
    }
}
//# sourceMappingURL=GenericFunctions.js.map
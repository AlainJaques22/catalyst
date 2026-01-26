"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustTaskFields = exports.adjustPersonFields = exports.adjustLeadFields = exports.adjustCompanyFields = void 0;
exports.copperApiRequest = copperApiRequest;
exports.getAutomaticSecret = getAutomaticSecret;
exports.adjustAddress = adjustAddress;
exports.adjustPhoneNumbers = adjustPhoneNumbers;
exports.adjustEmails = adjustEmails;
exports.adjustProjectIds = adjustProjectIds;
exports.adjustEmail = adjustEmail;
exports.copperApiRequestAllItems = copperApiRequestAllItems;
exports.handleListing = handleListing;
const crypto_1 = require("crypto");
const flow_1 = __importDefault(require("lodash/flow"));
const omit_1 = __importDefault(require("lodash/omit"));
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated API request to Copper.
 */
async function copperApiRequest(method, resource, body = {}, qs = {}, uri = '', option = {}) {
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        qs,
        body,
        url: uri || `https://api.copper.com/developer_api/v1${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    try {
        return await this.helpers.requestWithAuthentication.call(this, 'copperApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Creates a secret from the credentials
 *
 */
function getAutomaticSecret(credentials) {
    const data = `${credentials.email},${credentials.apiKey}`;
    return (0, crypto_1.createHash)('md5').update(data).digest('hex');
}
function adjustAddress(fixedCollection) {
    if (!fixedCollection.address)
        return fixedCollection;
    const adjusted = (0, omit_1.default)(fixedCollection, ['address']);
    if (fixedCollection.address) {
        adjusted.address = fixedCollection.address.addressFields;
    }
    return adjusted;
}
function adjustPhoneNumbers(fixedCollection) {
    if (!fixedCollection.phone_numbers)
        return fixedCollection;
    const adjusted = (0, omit_1.default)(fixedCollection, ['phone_numbers']);
    if (fixedCollection.phone_numbers) {
        adjusted.phone_numbers = fixedCollection.phone_numbers.phoneFields;
    }
    return adjusted;
}
function adjustEmails(fixedCollection) {
    if (!fixedCollection.emails)
        return fixedCollection;
    const adjusted = (0, omit_1.default)(fixedCollection, ['emails']);
    if (fixedCollection.emails) {
        adjusted.emails = fixedCollection.emails.emailFields;
    }
    return adjusted;
}
function adjustProjectIds(fields) {
    if (!fields.project_ids)
        return fields;
    const adjusted = (0, omit_1.default)(fields, ['project_ids']);
    adjusted.project_ids = fields.project_ids.includes(',')
        ? fields.project_ids.split(',')
        : [fields.project_ids];
    return adjusted;
}
function adjustEmail(fixedCollection) {
    if (!fixedCollection.email)
        return fixedCollection;
    const adjusted = (0, omit_1.default)(fixedCollection, ['email']);
    if (fixedCollection.email) {
        adjusted.email = fixedCollection.email.emailFields;
    }
    return adjusted;
}
exports.adjustCompanyFields = (0, flow_1.default)(adjustAddress, adjustPhoneNumbers);
exports.adjustLeadFields = (0, flow_1.default)(exports.adjustCompanyFields, adjustEmail);
exports.adjustPersonFields = (0, flow_1.default)(exports.adjustCompanyFields, adjustEmails);
exports.adjustTaskFields = (0, flow_1.default)(exports.adjustLeadFields, adjustProjectIds);
/**
 * Make an authenticated API request to Copper and return all items.
 */
async function copperApiRequestAllItems(method, resource, body = {}, qs = {}, uri = '', option = {}) {
    let responseData;
    qs.page_size = 200;
    let totalItems = 0;
    const returnData = [];
    do {
        responseData = await copperApiRequest.call(this, method, resource, body, qs, uri, option);
        totalItems = responseData.headers['x-pw-total'];
        returnData.push(...responseData.body);
    } while (totalItems > returnData.length);
    return returnData;
}
/**
 * Handle a Copper listing by returning all items or up to a limit.
 */
async function handleListing(method, endpoint, qs = {}, body = {}, uri = '') {
    const returnAll = this.getNodeParameter('returnAll', 0);
    const option = { resolveWithFullResponse: true };
    if (returnAll) {
        return await copperApiRequestAllItems.call(this, method, endpoint, body, qs, uri, option);
    }
    const limit = this.getNodeParameter('limit', 0);
    const responseData = await copperApiRequestAllItems.call(this, method, endpoint, body, qs, uri, option);
    return responseData.slice(0, limit);
}
//# sourceMappingURL=GenericFunctions.js.map
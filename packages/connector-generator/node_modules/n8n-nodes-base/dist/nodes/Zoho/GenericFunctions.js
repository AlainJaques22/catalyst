"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGetAllFilterOptions = exports.capitalizeInitial = exports.toLoadOptions = exports.adjustProductPayload = exports.adjustVendorPayload = exports.adjustSalesOrderPayload = exports.adjustQuotePayload = exports.adjustPurchaseOrderPayload = exports.adjustLeadPayload = exports.adjustInvoicePayloadOnUpdate = exports.adjustInvoicePayload = exports.adjustDealPayload = exports.adjustContactPayload = exports.adjustAccountPayload = exports.adjustProductDetailsOnUpdate = exports.adjustProductDetails = void 0;
exports.throwOnErrorStatus = throwOnErrorStatus;
exports.zohoApiRequest = zohoApiRequest;
exports.zohoApiRequestAllItems = zohoApiRequestAllItems;
exports.handleListing = handleListing;
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
exports.throwOnMissingProducts = throwOnMissingProducts;
exports.getModuleName = getModuleName;
exports.getFields = getFields;
exports.getPicklistOptions = getPicklistOptions;
const flow_1 = __importDefault(require("lodash/flow"));
const sortBy_1 = __importDefault(require("lodash/sortBy"));
const n8n_workflow_1 = require("n8n-workflow");
function throwOnErrorStatus(responseData) {
    if (responseData?.data?.[0].status === 'error') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), responseData);
    }
}
async function zohoApiRequest(method, endpoint, body = {}, qs = {}, uri) {
    const { oauthTokenData } = await this.getCredentials('zohoOAuth2Api');
    const options = {
        body: {
            data: [body],
        },
        method,
        qs,
        uri: uri || `${oauthTokenData.api_domain}/crm/v2${endpoint}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    try {
        const responseData = await this.helpers.requestOAuth2?.call(this, 'zohoOAuth2Api', options);
        if (responseData === undefined)
            return [];
        throwOnErrorStatus.call(this, responseData);
        return responseData;
    }
    catch (error) {
        const args = error.cause?.data
            ? {
                message: error.cause.data.message || 'The Zoho API returned an error.',
                description: JSON.stringify(error.cause.data, null, 2),
            }
            : undefined;
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, args);
    }
}
/**
 * Make an authenticated API request to Zoho CRM API and return all items.
 */
async function zohoApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    const returnData = [];
    let responseData;
    qs.per_page = 200;
    qs.page = 1;
    do {
        responseData = await zohoApiRequest.call(this, method, endpoint, body, qs);
        if (Array.isArray(responseData) && !responseData.length)
            return returnData;
        returnData.push(...responseData.data);
        qs.page++;
    } while (responseData.info.more_records !== undefined && responseData.info.more_records === true);
    return returnData;
}
/**
 * Handle a Zoho CRM API listing by returning all items or up to a limit.
 */
async function handleListing(method, endpoint, body = {}, qs = {}) {
    const returnAll = this.getNodeParameter('returnAll', 0);
    if (returnAll) {
        return await zohoApiRequestAllItems.call(this, method, endpoint, body, qs);
    }
    const responseData = await zohoApiRequestAllItems.call(this, method, endpoint, body, qs);
    const limit = this.getNodeParameter('limit', 0);
    return responseData.slice(0, limit);
}
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
}
function throwOnMissingProducts(resource, productDetails) {
    if (!productDetails.length) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one product for the ${resource}.`);
    }
}
// ----------------------------------------
//        required field adjusters
// ----------------------------------------
/**
 * Create a copy of an object without a specific property.
 */
const omit = (propertyToOmit, { [propertyToOmit]: _, ...remainingObject }) => remainingObject;
/**
 * Place a product ID at a nested position in a product details field.
 */
const adjustProductDetails = (productDetails, operation) => {
    return productDetails.map((p) => {
        const adjustedProduct = {
            product: { id: p.id },
            quantity: p.quantity || 1,
        };
        if (operation === 'upsert') {
            return { ...adjustedProduct, ...omit('id', p) };
        }
        else {
            return { ...adjustedProduct, ...omit('product', p) };
        }
    });
};
exports.adjustProductDetails = adjustProductDetails;
// ----------------------------------------
//        additional field adjusters
// ----------------------------------------
/**
 * Place a product ID at a nested position in a product details field.
 *
 * Only for updating products from Invoice, Purchase Order, Quote, and Sales Order.
 */
const adjustProductDetailsOnUpdate = (allFields) => {
    if (!allFields.Product_Details)
        return allFields;
    return allFields.Product_Details.map((p) => {
        return {
            ...omit('product', p),
            product: { id: p.id },
            quantity: p.quantity || 1,
        };
    });
};
exports.adjustProductDetailsOnUpdate = adjustProductDetailsOnUpdate;
/**
 * Place a location field's contents at the top level of the payload.
 */
const adjustLocationFields = (locationType) => (allFields) => {
    const locationField = allFields[locationType];
    if (!locationField)
        return allFields;
    return {
        ...omit(locationType, allFields),
        ...locationField.address_fields,
    };
};
const adjustAddressFields = adjustLocationFields('Address');
const adjustBillingAddressFields = adjustLocationFields('Billing_Address');
const adjustMailingAddressFields = adjustLocationFields('Mailing_Address');
const adjustShippingAddressFields = adjustLocationFields('Shipping_Address');
const adjustOtherAddressFields = adjustLocationFields('Other_Address');
/**
 * Remove from a date field the timestamp set by the datepicker.
 */
const adjustDateField = (dateType) => (allFields) => {
    const dateField = allFields[dateType];
    if (!dateField)
        return allFields;
    allFields[dateType] = dateField.split('T')[0];
    return allFields;
};
const adjustDateOfBirthField = adjustDateField('Date_of_Birth');
const adjustClosingDateField = adjustDateField('Closing_Date');
const adjustInvoiceDateField = adjustDateField('Invoice_Date');
const adjustDueDateField = adjustDateField('Due_Date');
const adjustPurchaseOrderDateField = adjustDateField('PO_Date');
const adjustValidTillField = adjustDateField('Valid_Till');
/**
 * Place an ID field's value nested inside the payload.
 */
const adjustIdField = (idType, nameProperty) => (allFields) => {
    const idValue = allFields[idType];
    if (!idValue)
        return allFields;
    return {
        ...omit(idType, allFields),
        [nameProperty]: { id: idValue },
    };
};
const adjustAccountIdField = adjustIdField('accountId', 'Account_Name');
const adjustContactIdField = adjustIdField('contactId', 'Full_Name');
const adjustDealIdField = adjustIdField('dealId', 'Deal_Name');
const adjustCustomFields = (allFields) => {
    const { customFields, ...rest } = allFields;
    if (!customFields?.customFields.length)
        return allFields;
    return customFields.customFields.reduce((acc, cur) => {
        acc[cur.fieldId] = cur.value;
        return acc;
    }, rest);
};
// ----------------------------------------
//           payload adjusters
// ----------------------------------------
exports.adjustAccountPayload = (0, flow_1.default)(adjustBillingAddressFields, adjustShippingAddressFields, adjustCustomFields);
exports.adjustContactPayload = (0, flow_1.default)(adjustMailingAddressFields, adjustOtherAddressFields, adjustDateOfBirthField, adjustCustomFields);
exports.adjustDealPayload = (0, flow_1.default)(adjustClosingDateField, adjustCustomFields);
exports.adjustInvoicePayload = (0, flow_1.default)(adjustBillingAddressFields, adjustShippingAddressFields, adjustInvoiceDateField, adjustDueDateField, adjustAccountIdField, adjustCustomFields);
exports.adjustInvoicePayloadOnUpdate = (0, flow_1.default)(exports.adjustInvoicePayload, exports.adjustProductDetailsOnUpdate);
exports.adjustLeadPayload = (0, flow_1.default)(adjustAddressFields, adjustCustomFields);
exports.adjustPurchaseOrderPayload = (0, flow_1.default)(adjustBillingAddressFields, adjustShippingAddressFields, adjustDueDateField, adjustPurchaseOrderDateField, adjustCustomFields);
exports.adjustQuotePayload = (0, flow_1.default)(adjustBillingAddressFields, adjustShippingAddressFields, adjustValidTillField, adjustCustomFields);
exports.adjustSalesOrderPayload = (0, flow_1.default)(adjustBillingAddressFields, adjustShippingAddressFields, adjustDueDateField, adjustAccountIdField, adjustContactIdField, adjustDealIdField, adjustCustomFields);
exports.adjustVendorPayload = (0, flow_1.default)(adjustAddressFields, adjustCustomFields);
exports.adjustProductPayload = adjustCustomFields;
// ----------------------------------------
//               helpers
// ----------------------------------------
/**
 * Convert items in a Zoho CRM API response into n8n load options.
 */
const toLoadOptions = (items, nameProperty) => items.map((item) => ({ name: item[nameProperty], value: item.id }));
exports.toLoadOptions = toLoadOptions;
function getModuleName(resource) {
    const map = {
        account: 'Accounts',
        contact: 'Contacts',
        deal: 'Deals',
        invoice: 'Invoices',
        lead: 'Leads',
        product: 'Products',
        purchaseOrder: 'Purchase_Orders',
        salesOrder: 'Sales_Orders',
        vendor: 'Vendors',
        quote: 'Quotes',
    };
    return map[resource];
}
/**
 * Retrieve all fields for a resource, sorted alphabetically.
 */
async function getFields(resource, { onlyCustom } = { onlyCustom: false }) {
    const qs = { module: getModuleName(resource) };
    let { fields } = (await zohoApiRequest.call(this, 'GET', '/settings/fields', {}, qs));
    if (onlyCustom) {
        fields = fields.filter(({ custom_field }) => custom_field);
    }
    const options = fields.map(({ field_label, api_name }) => ({
        name: field_label,
        value: api_name,
    }));
    return (0, sortBy_1.default)(options, (o) => o.name);
}
const capitalizeInitial = (str) => str[0].toUpperCase() + str.slice(1);
exports.capitalizeInitial = capitalizeInitial;
function getSectionApiName(resource) {
    if (resource === 'purchaseOrder')
        return 'Purchase Order Information';
    if (resource === 'salesOrder')
        return 'Sales Order Information';
    return `${(0, exports.capitalizeInitial)(resource)} Information`;
}
async function getPicklistOptions(resource, targetField) {
    const qs = { module: getModuleName(resource) };
    const responseData = (await zohoApiRequest.call(this, 'GET', '/settings/layouts', {}, qs));
    const pickListOptions = responseData.layouts[0].sections
        .find((section) => section.api_name === getSectionApiName(resource))
        ?.fields.find((f) => f.api_name === targetField)?.pick_list_values;
    if (!pickListOptions)
        return [];
    return pickListOptions.map((option) => ({
        name: option.display_value,
        value: option.actual_value,
    }));
}
/**
 * Add filter options to a query string object.
 */
const addGetAllFilterOptions = (qs, options) => {
    if (Object.keys(options).length) {
        const { fields, ...rest } = options;
        Object.assign(qs, fields && { fields: fields.join(',') }, rest);
    }
};
exports.addGetAllFilterOptions = addGetAllFilterOptions;
//# sourceMappingURL=GenericFunctions.js.map
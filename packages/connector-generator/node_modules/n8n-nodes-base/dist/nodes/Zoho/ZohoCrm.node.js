"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoCrm = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class ZohoCrm {
    description = {
        displayName: 'Zoho CRM',
        name: 'zohoCrm',
        icon: 'file:zoho.svg',
        group: ['transform'],
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        version: 1,
        description: 'Consume Zoho CRM API',
        defaults: {
            name: 'Zoho CRM',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'zohoOAuth2Api',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Account',
                        value: 'account',
                    },
                    {
                        name: 'Contact',
                        value: 'contact',
                    },
                    {
                        name: 'Deal',
                        value: 'deal',
                    },
                    {
                        name: 'Invoice',
                        value: 'invoice',
                    },
                    {
                        name: 'Lead',
                        value: 'lead',
                    },
                    {
                        name: 'Product',
                        value: 'product',
                    },
                    {
                        name: 'Purchase Order',
                        value: 'purchaseOrder',
                    },
                    {
                        name: 'Quote',
                        value: 'quote',
                    },
                    {
                        name: 'Sales Order',
                        value: 'salesOrder',
                    },
                    {
                        name: 'Vendor',
                        value: 'vendor',
                    },
                ],
                default: 'account',
            },
            ...descriptions_1.accountOperations,
            ...descriptions_1.accountFields,
            ...descriptions_1.contactOperations,
            ...descriptions_1.contactFields,
            ...descriptions_1.dealOperations,
            ...descriptions_1.dealFields,
            ...descriptions_1.invoiceOperations,
            ...descriptions_1.invoiceFields,
            ...descriptions_1.leadOperations,
            ...descriptions_1.leadFields,
            ...descriptions_1.productOperations,
            ...descriptions_1.productFields,
            ...descriptions_1.purchaseOrderOperations,
            ...descriptions_1.purchaseOrderFields,
            ...descriptions_1.quoteOperations,
            ...descriptions_1.quoteFields,
            ...descriptions_1.salesOrderOperations,
            ...descriptions_1.salesOrderFields,
            ...descriptions_1.vendorOperations,
            ...descriptions_1.vendorFields,
        ],
    };
    methods = {
        loadOptions: {
            // ----------------------------------------
            //               resources
            // ----------------------------------------
            async getAccounts() {
                const accounts = (await GenericFunctions_1.zohoApiRequestAllItems.call(this, 'GET', '/accounts'));
                return (0, GenericFunctions_1.toLoadOptions)(accounts, 'Account_Name');
            },
            async getContacts() {
                const contacts = (await GenericFunctions_1.zohoApiRequestAllItems.call(this, 'GET', '/contacts'));
                return (0, GenericFunctions_1.toLoadOptions)(contacts, 'Full_Name');
            },
            async getDeals() {
                const deals = (await GenericFunctions_1.zohoApiRequestAllItems.call(this, 'GET', '/deals'));
                return (0, GenericFunctions_1.toLoadOptions)(deals, 'Deal_Name');
            },
            async getProducts() {
                const products = (await GenericFunctions_1.zohoApiRequestAllItems.call(this, 'GET', '/products'));
                return (0, GenericFunctions_1.toLoadOptions)(products, 'Product_Name');
            },
            async getVendors() {
                const vendors = (await GenericFunctions_1.zohoApiRequestAllItems.call(this, 'GET', '/vendors'));
                return (0, GenericFunctions_1.toLoadOptions)(vendors, 'Vendor_Name');
            },
            // ----------------------------------------
            //             resource fields
            // ----------------------------------------
            // standard fields - called from `makeGetAllFields`
            async getAccountFields() {
                return await GenericFunctions_1.getFields.call(this, 'account');
            },
            async getContactFields() {
                return await GenericFunctions_1.getFields.call(this, 'contact');
            },
            async getDealFields() {
                return await GenericFunctions_1.getFields.call(this, 'deal');
            },
            async getInvoiceFields() {
                return await GenericFunctions_1.getFields.call(this, 'invoice');
            },
            async getLeadFields() {
                return await GenericFunctions_1.getFields.call(this, 'lead');
            },
            async getProductFields() {
                return await GenericFunctions_1.getFields.call(this, 'product');
            },
            async getPurchaseOrderFields() {
                return await GenericFunctions_1.getFields.call(this, 'purchase_order');
            },
            async getVendorOrderFields() {
                return await GenericFunctions_1.getFields.call(this, 'vendor');
            },
            async getQuoteFields() {
                return await GenericFunctions_1.getFields.call(this, 'quote');
            },
            async getSalesOrderFields() {
                return await GenericFunctions_1.getFields.call(this, 'sales_order');
            },
            async getVendorFields() {
                return await GenericFunctions_1.getFields.call(this, 'vendor');
            },
            // custom fields
            async getCustomAccountFields() {
                return await GenericFunctions_1.getFields.call(this, 'account', { onlyCustom: true });
            },
            async getCustomContactFields() {
                return await GenericFunctions_1.getFields.call(this, 'contact', { onlyCustom: true });
            },
            async getCustomDealFields() {
                return await GenericFunctions_1.getFields.call(this, 'deal', { onlyCustom: true });
            },
            async getCustomInvoiceFields() {
                return await GenericFunctions_1.getFields.call(this, 'invoice', { onlyCustom: true });
            },
            async getCustomLeadFields() {
                return await GenericFunctions_1.getFields.call(this, 'lead', { onlyCustom: true });
            },
            async getCustomProductFields() {
                return await GenericFunctions_1.getFields.call(this, 'product', { onlyCustom: true });
            },
            async getCustomPurchaseOrderFields() {
                return await GenericFunctions_1.getFields.call(this, 'purchase_order', { onlyCustom: true });
            },
            async getCustomVendorOrderFields() {
                return await GenericFunctions_1.getFields.call(this, 'vendor', { onlyCustom: true });
            },
            async getCustomQuoteFields() {
                return await GenericFunctions_1.getFields.call(this, 'quote', { onlyCustom: true });
            },
            async getCustomSalesOrderFields() {
                return await GenericFunctions_1.getFields.call(this, 'sales_order', { onlyCustom: true });
            },
            async getCustomVendorFields() {
                return await GenericFunctions_1.getFields.call(this, 'vendor', { onlyCustom: true });
            },
            // ----------------------------------------
            //        resource picklist options
            // ----------------------------------------
            async getAccountType() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'Account_Type');
            },
            async getDealStage() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'deal', 'Stage');
            },
            async getPurchaseOrderStatus() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'purchaseOrder', 'Status');
            },
            async getSalesOrderStatus() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'salesOrder', 'Status');
            },
            async getQuoteStage() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'quote', 'Quote_Stage');
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            // https://www.zoho.com/crm/developer/docs/api/insert-records.html
            // https://www.zoho.com/crm/developer/docs/api/get-records.html
            // https://www.zoho.com/crm/developer/docs/api/update-specific-record.html
            // https://www.zoho.com/crm/developer/docs/api/delete-specific-record.html
            // https://www.zoho.com/crm/developer/docs/api/v2/upsert-records.html
            try {
                if (resource === 'account') {
                    // **********************************************************************
                    //                                account
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/accounts-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Accounts
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             account: create
                        // ----------------------------------------
                        const body = {
                            Account_Name: this.getNodeParameter('accountName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustAccountPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/accounts', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             account: delete
                        // ----------------------------------------
                        const accountId = this.getNodeParameter('accountId', i);
                        const endpoint = `/accounts/${accountId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', endpoint);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //               account: get
                        // ----------------------------------------
                        const accountId = this.getNodeParameter('accountId', i);
                        const endpoint = `/accounts/${accountId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             account: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/accounts', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             account: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustAccountPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const accountId = this.getNodeParameter('accountId', i);
                        const endpoint = `/accounts/${accountId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', endpoint, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //             account: upsert
                        // ----------------------------------------
                        const body = {
                            Account_Name: this.getNodeParameter('accountName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustAccountPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/accounts/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'contact') {
                    // **********************************************************************
                    //                                contact
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/contacts-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Contacts
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             contact: create
                        // ----------------------------------------
                        const body = {
                            Last_Name: this.getNodeParameter('lastName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustContactPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/contacts', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             contact: delete
                        // ----------------------------------------
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contacts/${contactId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', endpoint);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //               contact: get
                        // ----------------------------------------
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contacts/${contactId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             contact: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/contacts', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             contact: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustContactPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contacts/${contactId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', endpoint, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //             contact: upsert
                        // ----------------------------------------
                        const body = {
                            Last_Name: this.getNodeParameter('lastName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustContactPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/contacts/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'deal') {
                    // **********************************************************************
                    //                                deal
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/deals-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Deals
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               deal: create
                        // ----------------------------------------
                        const body = {
                            Deal_Name: this.getNodeParameter('dealName', i),
                            Stage: this.getNodeParameter('stage', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustDealPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/deals', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               deal: delete
                        // ----------------------------------------
                        const dealId = this.getNodeParameter('dealId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', `/deals/${dealId}`);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                deal: get
                        // ----------------------------------------
                        const dealId = this.getNodeParameter('dealId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', `/deals/${dealId}`);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               deal: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/deals', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               deal: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustDealPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const dealId = this.getNodeParameter('dealId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', `/deals/${dealId}`, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //              deal: upsert
                        // ----------------------------------------
                        const body = {
                            Deal_Name: this.getNodeParameter('dealName', i),
                            Stage: this.getNodeParameter('stage', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustDealPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/deals/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'invoice') {
                    // **********************************************************************
                    //                                invoice
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/invoices-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Invoices
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             invoice: create
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        GenericFunctions_1.throwOnMissingProducts.call(this, resource, productDetails);
                        const body = {
                            Subject: this.getNodeParameter('subject', i),
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustInvoicePayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/invoices', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             invoice: delete
                        // ----------------------------------------
                        const invoiceId = this.getNodeParameter('invoiceId', i);
                        const endpoint = `/invoices/${invoiceId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', endpoint);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //               invoice: get
                        // ----------------------------------------
                        const invoiceId = this.getNodeParameter('invoiceId', i);
                        const endpoint = `/invoices/${invoiceId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             invoice: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/invoices', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             invoice: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustInvoicePayloadOnUpdate)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const invoiceId = this.getNodeParameter('invoiceId', i);
                        const endpoint = `/invoices/${invoiceId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', endpoint, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //             invoice: upsert
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        const body = {
                            Subject: this.getNodeParameter('subject', i),
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustInvoicePayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/invoices/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'lead') {
                    // **********************************************************************
                    //                                  lead
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Leads
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               lead: create
                        // ----------------------------------------
                        const body = {
                            Company: this.getNodeParameter('Company', i),
                            Last_Name: this.getNodeParameter('lastName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustLeadPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/leads', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               lead: delete
                        // ----------------------------------------
                        const leadId = this.getNodeParameter('leadId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', `/leads/${leadId}`);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                lead: get
                        // ----------------------------------------
                        const leadId = this.getNodeParameter('leadId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', `/leads/${leadId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               lead: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/leads', {}, qs);
                    }
                    else if (operation === 'getFields') {
                        // ----------------------------------------
                        //            lead: getFields
                        // ----------------------------------------
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', '/settings/fields', {}, { module: 'leads' });
                        responseData = responseData.fields;
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               lead: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustLeadPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const leadId = this.getNodeParameter('leadId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', `/leads/${leadId}`, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //              lead: upsert
                        // ----------------------------------------
                        const body = {
                            Company: this.getNodeParameter('Company', i),
                            Last_Name: this.getNodeParameter('lastName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustLeadPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/leads/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'product') {
                    // **********************************************************************
                    //                              product
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/products-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Products
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             product: create
                        // ----------------------------------------
                        const body = {
                            Product_Name: this.getNodeParameter('productName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustProductPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/products', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //            product: delete
                        // ----------------------------------------
                        const productId = this.getNodeParameter('productId', i);
                        const endpoint = `/products/${productId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', endpoint);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //              product: get
                        // ----------------------------------------
                        const productId = this.getNodeParameter('productId', i);
                        const endpoint = `/products/${productId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //            product: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/products', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //            product: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustProductPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const productId = this.getNodeParameter('productId', i);
                        const endpoint = `/products/${productId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', endpoint, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //             product: upsert
                        // ----------------------------------------
                        const body = {
                            Product_Name: this.getNodeParameter('productName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustProductPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/products/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'purchaseOrder') {
                    // **********************************************************************
                    //                             purchaseOrder
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/purchase-orders-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Purchase_Order
                    if (operation === 'create') {
                        // ----------------------------------------
                        //          purchaseOrder: create
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        GenericFunctions_1.throwOnMissingProducts.call(this, resource, productDetails);
                        const body = {
                            Subject: this.getNodeParameter('subject', i),
                            Vendor_Name: { id: this.getNodeParameter('vendorId', i) },
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustPurchaseOrderPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/purchase_orders', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //          purchaseOrder: delete
                        // ----------------------------------------
                        const purchaseOrderId = this.getNodeParameter('purchaseOrderId', i);
                        const endpoint = `/purchase_orders/${purchaseOrderId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', endpoint);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //            purchaseOrder: get
                        // ----------------------------------------
                        const purchaseOrderId = this.getNodeParameter('purchaseOrderId', i);
                        const endpoint = `/purchase_orders/${purchaseOrderId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //          purchaseOrder: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/purchase_orders', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //          purchaseOrder: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustPurchaseOrderPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const purchaseOrderId = this.getNodeParameter('purchaseOrderId', i);
                        const endpoint = `/purchase_orders/${purchaseOrderId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', endpoint, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //          purchaseOrder: upsert
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        const body = {
                            Subject: this.getNodeParameter('subject', i),
                            Vendor_Name: { id: this.getNodeParameter('vendorId', i) },
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustPurchaseOrderPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/purchase_orders/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'quote') {
                    // **********************************************************************
                    //                                 quote
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/quotes-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Quotes
                    if (operation === 'create') {
                        // ----------------------------------------
                        //              quote: create
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        GenericFunctions_1.throwOnMissingProducts.call(this, resource, productDetails);
                        const body = {
                            Subject: this.getNodeParameter('subject', i),
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustQuotePayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/quotes', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //              quote: delete
                        // ----------------------------------------
                        const quoteId = this.getNodeParameter('quoteId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', `/quotes/${quoteId}`);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                quote: get
                        // ----------------------------------------
                        const quoteId = this.getNodeParameter('quoteId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', `/quotes/${quoteId}`);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //              quote: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/quotes', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //              quote: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustQuotePayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const quoteId = this.getNodeParameter('quoteId', i);
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', `/quotes/${quoteId}`, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //              quote: upsert
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        const body = {
                            Subject: this.getNodeParameter('subject', i),
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustQuotePayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/quotes/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'salesOrder') {
                    // **********************************************************************
                    //                               salesOrder
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/sales-orders-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Sales_Orders
                    if (operation === 'create') {
                        // ----------------------------------------
                        //            salesOrder: create
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        const body = {
                            Account_Name: { id: this.getNodeParameter('accountId', i) },
                            Subject: this.getNodeParameter('subject', i),
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustSalesOrderPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/sales_orders', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //            salesOrder: delete
                        // ----------------------------------------
                        const salesOrderId = this.getNodeParameter('salesOrderId', i);
                        const endpoint = `/sales_orders/${salesOrderId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', endpoint);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //             salesOrder: get
                        // ----------------------------------------
                        const salesOrderId = this.getNodeParameter('salesOrderId', i);
                        const endpoint = `/sales_orders/${salesOrderId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //            salesOrder: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/sales_orders', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //            salesOrder: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustSalesOrderPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const salesOrderId = this.getNodeParameter('salesOrderId', i);
                        const endpoint = `/sales_orders/${salesOrderId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', endpoint, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //           salesOrder: upsert
                        // ----------------------------------------
                        const productDetails = this.getNodeParameter('Product_Details', i);
                        const body = {
                            Account_Name: { id: this.getNodeParameter('accountId', i) },
                            Subject: this.getNodeParameter('subject', i),
                            Product_Details: (0, GenericFunctions_1.adjustProductDetails)(productDetails, 'upsert'),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustSalesOrderPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/sales_orders/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
                else if (resource === 'vendor') {
                    // **********************************************************************
                    //                               vendor
                    // **********************************************************************
                    // https://www.zoho.com/crm/developer/docs/api/v2/vendors-response.html
                    // https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/standard-modules-fields#Vendors
                    if (operation === 'create') {
                        // ----------------------------------------
                        //            vendor: create
                        // ----------------------------------------
                        const body = {
                            Vendor_Name: this.getNodeParameter('vendorName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustVendorPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/vendors', body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //            vendor: delete
                        // ----------------------------------------
                        const vendorId = this.getNodeParameter('vendorId', i);
                        const endpoint = `/vendors/${vendorId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'DELETE', endpoint);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //             vendor: get
                        // ----------------------------------------
                        const vendorId = this.getNodeParameter('vendorId', i);
                        const endpoint = `/vendors/${vendorId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.data;
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //            vendor: getAll
                        // ----------------------------------------
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.addGetAllFilterOptions)(qs, options);
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/vendors', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //            vendor: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustVendorPayload)(updateFields));
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const vendorId = this.getNodeParameter('vendorId', i);
                        const endpoint = `/vendors/${vendorId}`;
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'PUT', endpoint, body);
                        responseData = responseData.data[0].details;
                    }
                    else if (operation === 'upsert') {
                        // ----------------------------------------
                        //             vendor: upsert
                        // ----------------------------------------
                        const body = {
                            Vendor_Name: this.getNodeParameter('vendorName', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustVendorPayload)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.zohoApiRequest.call(this, 'POST', '/vendors/upsert', body);
                        responseData = responseData.data[0].details;
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message, json: {} });
                    continue;
                }
                throw error;
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.ZohoCrm = ZohoCrm;
//# sourceMappingURL=ZohoCrm.node.js.map
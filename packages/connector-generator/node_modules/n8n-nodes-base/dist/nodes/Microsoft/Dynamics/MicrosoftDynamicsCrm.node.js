"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftDynamicsCrm = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class MicrosoftDynamicsCrm {
    description = {
        displayName: 'Microsoft Dynamics CRM',
        name: 'microsoftDynamicsCrm',
        icon: { light: 'file:microsoftDynamicsCrm.svg', dark: 'file:microsoftDynamicsCrm.dark.svg' },
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Microsoft Dynamics CRM API',
        defaults: {
            name: 'Microsoft Dynamics CRM',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'microsoftDynamicsOAuth2Api',
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
                ],
                default: 'account',
            },
            ...descriptions_1.accountOperations,
            ...descriptions_1.accountFields,
        ],
    };
    methods = {
        loadOptions: {
            async getAccountCategories() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'accountcategorycode');
            },
            async getAccountRatingCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'accountratingcode');
            },
            async getAddressTypes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'address1_addresstypecode');
            },
            async getBusinessTypes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'businesstypecode');
            },
            async getCustomerSizeCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'customersizecode');
            },
            async getCustomerTypeCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'customertypecode');
            },
            async getIndustryCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'industrycode');
            },
            async getPaymentTermsCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'paymenttermscode');
            },
            async getPreferredAppointmentDayCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'preferredappointmentdaycode');
            },
            async getPreferredAppointmentTimeCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'preferredappointmenttimecode');
            },
            async getPreferredContactMethodCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'preferredcontactmethodcode');
            },
            async getShippingMethodCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'shippingmethodcode');
            },
            async getTerritoryCodes() {
                return await GenericFunctions_1.getPicklistOptions.call(this, 'account', 'territorycode');
            },
            async getAccountFields() {
                const fields = await GenericFunctions_1.getEntityFields.call(this, 'account');
                const isSelectable = (field) => field.IsValidForRead &&
                    field.CanBeSecuredForRead &&
                    field.IsValidODataAttribute &&
                    field.LogicalName !== 'slaid';
                return fields
                    .filter(isSelectable)
                    .filter((field) => field.DisplayName.UserLocalizedLabel?.Label)
                    .map((field) => ({
                    name: field.DisplayName.UserLocalizedLabel.Label,
                    value: field.LogicalName,
                }))
                    .sort(GenericFunctions_1.sort);
            },
            async getExpandableAccountFields() {
                const fields = await GenericFunctions_1.getEntityFields.call(this, 'account');
                const isSelectable = (field) => field.IsValidForRead &&
                    field.CanBeSecuredForRead &&
                    field.IsValidODataAttribute &&
                    field.AttributeType === 'Lookup' &&
                    field.LogicalName !== 'slaid';
                return fields
                    .filter(isSelectable)
                    .map((field) => ({
                    name: field.DisplayName.UserLocalizedLabel.Label,
                    value: field.LogicalName,
                }))
                    .sort(GenericFunctions_1.sort);
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        const qs = {};
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < length; i++) {
            try {
                if (resource === 'account') {
                    //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/create-entity-web-api
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const options = this.getNodeParameter('options', i);
                        const body = {
                            name,
                            ...additionalFields,
                        };
                        if (body?.addresses?.address) {
                            Object.assign(body, (0, GenericFunctions_1.adjustAddresses)(body.addresses.address));
                            //@ts-ignore
                            delete body?.addresses;
                        }
                        if (options.returnFields) {
                            options.returnFields.push('accountid');
                            qs.$select = options.returnFields.join(',');
                        }
                        else {
                            qs.$select = 'accountid';
                        }
                        responseData = await GenericFunctions_1.microsoftApiRequest.call(this, 'POST', '/accounts', body, qs);
                    }
                    if (operation === 'delete') {
                        //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/update-delete-entities-using-web-api#basic-delete
                        const accountId = this.getNodeParameter('accountId', i);
                        await GenericFunctions_1.microsoftApiRequest.call(this, 'DELETE', `/accounts(${accountId})`, {}, qs);
                        responseData = { success: true };
                    }
                    if (operation === 'get') {
                        //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/retrieve-entity-using-web-api
                        const accountId = this.getNodeParameter('accountId', i);
                        const options = this.getNodeParameter('options', i);
                        if (options.returnFields) {
                            qs.$select = options.returnFields.join(',');
                        }
                        if (options.expandFields) {
                            qs.$expand = options.expandFields.join(',');
                        }
                        responseData = await GenericFunctions_1.microsoftApiRequest.call(this, 'GET', `/accounts(${accountId})`, {}, qs);
                    }
                    if (operation === 'getAll') {
                        //https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/query-data-web-api
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const options = this.getNodeParameter('options', i);
                        const filters = this.getNodeParameter('filters', i);
                        if (options.returnFields) {
                            qs.$select = options.returnFields.join(',');
                        }
                        if (options.expandFields) {
                            qs.$expand = options.expandFields.join(',');
                        }
                        if (filters.query) {
                            qs.$filter = filters.query;
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', '/accounts', {}, qs);
                        }
                        else {
                            qs.$top = this.getNodeParameter('limit', 0);
                            responseData = await GenericFunctions_1.microsoftApiRequest.call(this, 'GET', '/accounts', {}, qs);
                            responseData = responseData.value;
                        }
                    }
                    if (operation === 'update') {
                        const accountId = this.getNodeParameter('accountId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const options = this.getNodeParameter('options', i);
                        const body = {
                            ...updateFields,
                        };
                        if (body?.addresses?.address) {
                            Object.assign(body, (0, GenericFunctions_1.adjustAddresses)(body.addresses.address));
                            //@ts-ignore
                            delete body?.addresses;
                        }
                        if (options.returnFields) {
                            options.returnFields.push('accountid');
                            qs.$select = options.returnFields.join(',');
                        }
                        else {
                            qs.$select = 'accountid';
                        }
                        responseData = await GenericFunctions_1.microsoftApiRequest.call(this, 'PATCH', `/accounts(${accountId})`, body, qs);
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.MicrosoftDynamicsCrm = MicrosoftDynamicsCrm;
//# sourceMappingURL=MicrosoftDynamicsCrm.node.js.map
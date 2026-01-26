"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSuiteAdmin = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const DeviceDescription_1 = require("./DeviceDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const GroupDescription_1 = require("./GroupDescription");
const SearchFunctions_1 = require("./SearchFunctions");
const UserDescription_1 = require("./UserDescription");
class GSuiteAdmin {
    description = {
        displayName: 'Google Workspace Admin',
        name: 'gSuiteAdmin',
        icon: 'file:gSuiteAdmin.svg',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Google Workspace Admin API',
        defaults: {
            name: 'Google Workspace Admin',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'gSuiteAdminOAuth2Api',
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
                        name: 'ChromeOS Device',
                        value: 'device',
                    },
                    {
                        name: 'Group',
                        value: 'group',
                    },
                    {
                        name: 'User',
                        value: 'user',
                    },
                ],
                default: 'user',
            },
            ...DeviceDescription_1.deviceOperations,
            ...DeviceDescription_1.deviceFields,
            ...GroupDescription_1.groupOperations,
            ...GroupDescription_1.groupFields,
            ...UserDescription_1.userOperations,
            ...UserDescription_1.userFields,
        ],
    };
    methods = {
        loadOptions: {
            async getDomains() {
                const returnData = [];
                const domains = (await GenericFunctions_1.googleApiRequestAllItems.call(this, 'domains', 'GET', '/directory/v1/customer/my_customer/domains'));
                for (const domain of domains) {
                    const domainName = domain.domainName;
                    const domainId = domain.domainName;
                    returnData.push({
                        name: domainName,
                        value: domainId,
                    });
                }
                return returnData;
            },
            async getSchemas() {
                const schemas = (await GenericFunctions_1.googleApiRequestAllItems.call(this, 'schemas', 'GET', '/directory/v1/customer/my_customer/schemas'));
                return schemas.map((schema) => ({
                    name: schema.displayName || schema.schemaName,
                    value: schema.schemaName,
                }));
            },
            async getOrgUnits() {
                const returnData = [];
                const orgUnits = (await GenericFunctions_1.googleApiRequest.call(this, 'GET', '/directory/v1/customer/my_customer/orgunits', {}, { orgUnitPath: '/', type: 'all' }));
                for (const unit of orgUnits.organizationUnits) {
                    returnData.push({
                        name: unit.name,
                        value: unit.orgUnitPath,
                    });
                }
                return returnData;
            },
        },
        listSearch: {
            searchDevices: SearchFunctions_1.searchDevices,
            searchGroups: SearchFunctions_1.searchGroups,
            searchUsers: SearchFunctions_1.searchUsers,
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < length; i++) {
            const qs = {};
            try {
                if (resource === 'device') {
                    //https://developers.google.com/admin-sdk/directory/v1/customer/my_customer/devices/chromeos/deviceId
                    if (operation === 'get') {
                        const deviceId = this.getNodeParameter('deviceId', i, undefined, {
                            extractValue: true,
                        });
                        const output = this.getNodeParameter('projection', 1);
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/customer/my_customer/devices/chromeos/${deviceId}?projection=${output}`, {});
                    }
                    //https://developers.google.com/admin-sdk/directory/reference/rest/v1/chromeosdevices/list
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const output = this.getNodeParameter('projection', 1);
                        const includeChildren = this.getNodeParameter('includeChildOrgunits', i);
                        const filter = this.getNodeParameter('filter', i, {});
                        const sort = this.getNodeParameter('sort', i, {});
                        qs.projection = output;
                        qs.includeChildOrgunits = includeChildren;
                        if (qs.customer === undefined) {
                            qs.customer = 'my_customer';
                        }
                        if (filter.orgUnitPath) {
                            qs.orgUnitPath = filter.orgUnitPath;
                        }
                        if (filter.query) {
                            qs.query = filter.query.trim();
                        }
                        if (sort.sortRules) {
                            const { orderBy, sortOrder } = sort.sortRules;
                            if (orderBy) {
                                qs.orderBy = orderBy;
                            }
                            if (sortOrder) {
                                qs.sortOrder = sortOrder;
                            }
                        }
                        if (!returnAll) {
                            qs.maxResults = this.getNodeParameter('limit', i);
                        }
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/customer/${qs.customer}/devices/chromeos/`, {}, qs);
                        if (!Array.isArray(responseData) || responseData.length === 0) {
                            return [this.helpers.returnJsonArray({})];
                        }
                        return [this.helpers.returnJsonArray(responseData)];
                    }
                    if (operation === 'update') {
                        const deviceId = this.getNodeParameter('deviceId', i, undefined, {
                            extractValue: true,
                        });
                        const updateOptions = this.getNodeParameter('updateOptions', 1);
                        Object.assign(qs, updateOptions);
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/directory/v1/customer/my_customer/devices/chromeos/${deviceId}`, qs);
                    }
                    if (operation === 'changeStatus') {
                        const deviceId = this.getNodeParameter('deviceId', i, undefined, {
                            extractValue: true,
                        });
                        const action = this.getNodeParameter('action', 1);
                        qs.action = action;
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'POST', `/directory/v1/customer/my_customer/devices/chromeos/${deviceId}/action`, qs);
                    }
                }
                else if (resource === 'group') {
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/insert
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i);
                        const email = this.getNodeParameter('email', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            name,
                            email,
                        };
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'POST', '/directory/v1/groups', body);
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/delete
                    if (operation === 'delete') {
                        const groupId = this.getNodeParameter('groupId', i, undefined, {
                            extractValue: true,
                        });
                        await GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/directory/v1/groups/${groupId}`, {});
                        responseData = { success: true };
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/get
                    if (operation === 'get') {
                        const groupId = this.getNodeParameter('groupId', i, undefined, {
                            extractValue: true,
                        });
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/groups/${groupId}`, {});
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/list
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filter = this.getNodeParameter('filter', i, {});
                        const sort = this.getNodeParameter('sort', i, {});
                        if (filter.customer) {
                            qs.customer = filter.customer;
                        }
                        if (filter.domain) {
                            qs.domain = filter.domain;
                        }
                        if (filter.query) {
                            const query = filter.query.trim();
                            const regex = /^(name|email):\S+$/;
                            if (!regex.test(query)) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid query format. Query must follow the format "displayName:<value>" or "email:<value>".');
                            }
                            qs.query = query;
                        }
                        if (filter.userId) {
                            qs.userKey = filter.userId;
                        }
                        else if (!qs.customer) {
                            // userKey and customer cannot be defined together
                            qs.customer = 'my_customer';
                        }
                        if (sort.sortRules) {
                            const { orderBy, sortOrder } = sort.sortRules;
                            if (orderBy) {
                                qs.orderBy = orderBy;
                            }
                            if (sortOrder) {
                                qs.sortOrder = sortOrder;
                            }
                        }
                        if (!returnAll) {
                            qs.maxResults = this.getNodeParameter('limit', i);
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.googleApiRequestAllItems.call(this, 'groups', 'GET', '/directory/v1/groups', {}, qs);
                        }
                        else {
                            qs.maxResults = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.googleApiRequest.call(this, 'GET', '/directory/v1/groups', {}, qs);
                            responseData = responseData.groups || [];
                        }
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/groups/update
                    if (operation === 'update') {
                        const groupId = this.getNodeParameter('groupId', i, undefined, {
                            extractValue: true,
                        });
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        Object.assign(body, updateFields);
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/directory/v1/groups/${groupId}`, body);
                    }
                }
                else if (resource === 'user') {
                    //https://developers.google.com/admin-sdk/directory/reference/rest/v1/members/insert
                    if (operation === 'addToGroup') {
                        const groupId = this.getNodeParameter('groupId', i, undefined, {
                            extractValue: true,
                        });
                        const userId = this.getNodeParameter('userId', i, undefined, {
                            extractValue: true,
                        });
                        let userEmail;
                        // If the user ID is not already an email, fetch the user details
                        if (!userId.includes('@')) {
                            const userDetails = (await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/users/${userId}`));
                            userEmail = userDetails.primaryEmail;
                        }
                        else {
                            userEmail = userId;
                        }
                        if (!userEmail) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Unable to determine the user email for adding to the group', { itemIndex: i });
                        }
                        const body = {
                            email: userEmail,
                            role: 'MEMBER',
                        };
                        await GenericFunctions_1.googleApiRequest.call(this, 'POST', `/directory/v1/groups/${groupId}/members`, body);
                        responseData = { added: true };
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/insert
                    if (operation === 'create') {
                        const domain = this.getNodeParameter('domain', i);
                        const firstName = this.getNodeParameter('firstName', i);
                        const lastName = this.getNodeParameter('lastName', i);
                        const password = this.getNodeParameter('password', i);
                        const username = this.getNodeParameter('username', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            name: {
                                familyName: lastName,
                                givenName: firstName,
                            },
                            password,
                            primaryEmail: `${username}@${domain}`,
                        };
                        if (!username) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), "The parameter 'Username' is empty", {
                                itemIndex: i,
                                description: "Please fill in the 'Username' parameter to create the user",
                            });
                        }
                        if (additionalFields.changePasswordAtNextLogin !== undefined) {
                            body.changePasswordAtNextLogin =
                                additionalFields.changePasswordAtNextLogin;
                        }
                        if (additionalFields.phoneUi) {
                            body.phones = additionalFields.phoneUi.phoneValues;
                        }
                        if (additionalFields.emailUi) {
                            body.emails = additionalFields.emailUi.emailValues;
                        }
                        if (additionalFields.roles) {
                            const roles = additionalFields.roles;
                            body.roles = {
                                superAdmin: roles.includes('superAdmin'),
                                groupsAdmin: roles.includes('groupsAdmin'),
                                groupsReader: roles.includes('groupsReader'),
                                groupsEditor: roles.includes('groupsEditor'),
                                userManagement: roles.includes('userManagement'),
                                helpDeskAdmin: roles.includes('helpDeskAdmin'),
                                servicesAdmin: roles.includes('servicesAdmin'),
                                inventoryReportingAdmin: roles.includes('inventoryReportingAdmin'),
                                storageAdmin: roles.includes('storageAdmin'),
                                directorySyncAdmin: roles.includes('directorySyncAdmin'),
                                mobileAdmin: roles.includes('mobileAdmin'),
                            };
                        }
                        if (additionalFields.customFields) {
                            const customFields = additionalFields.customFields
                                .fieldValues;
                            const customSchemas = {};
                            customFields.forEach((field) => {
                                const { schemaName, fieldName, value } = field;
                                if (!schemaName || !fieldName || !value) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid custom field data', {
                                        itemIndex: i,
                                        description: 'Schema name, field name, and value are required.',
                                    });
                                }
                                customSchemas[schemaName] ??= {};
                                customSchemas[schemaName][fieldName] = value;
                            });
                            if (Object.keys(customSchemas).length > 0) {
                                body.customSchemas = customSchemas;
                            }
                        }
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'POST', '/directory/v1/users', body, qs);
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/delete
                    if (operation === 'delete') {
                        const userId = this.getNodeParameter('userId', i, undefined, {
                            extractValue: true,
                        });
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/directory/v1/users/${userId}`, {});
                        responseData = { deleted: true };
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/get
                    if (operation === 'get') {
                        const userId = this.getNodeParameter('userId', i, undefined, {
                            extractValue: true,
                        });
                        const output = this.getNodeParameter('output', i);
                        const projection = this.getNodeParameter('projection', i);
                        const fields = this.getNodeParameter('fields', i, []);
                        if (projection) {
                            qs.projection = projection;
                        }
                        if (projection === 'custom' && qs.customFieldMask) {
                            qs.customFieldMask = qs.customFieldMask.join(',');
                        }
                        if (output === 'select') {
                            if (!fields.includes('id')) {
                                fields.push('id');
                            }
                            qs.fields = fields.join(',');
                        }
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'GET', `/directory/v1/users/${userId}`, {}, qs);
                        if (output === 'simplified') {
                            responseData = {
                                kind: responseData.kind,
                                id: responseData.id,
                                primaryEmail: responseData.primaryEmail,
                                name: responseData.name,
                                isAdmin: responseData.isAdmin,
                                lastLoginTime: responseData.lastLoginTime,
                                creationTime: responseData.creationTime,
                                suspended: responseData.suspended,
                            };
                        }
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/list
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const output = this.getNodeParameter('output', i);
                        const fields = this.getNodeParameter('fields', i, []);
                        const projection = this.getNodeParameter('projection', i);
                        const filter = this.getNodeParameter('filter', i, {});
                        const sort = this.getNodeParameter('sort', i, {});
                        if (filter.customer) {
                            qs.customer = filter.customer;
                        }
                        if (filter.domain) {
                            qs.domain = filter.domain;
                        }
                        if (filter.query) {
                            qs.query = filter.query.trim();
                        }
                        if (filter.showDeleted) {
                            qs.showDeleted = filter.showDeleted ? 'true' : 'false';
                        }
                        if (sort.sortRules) {
                            const { orderBy, sortOrder } = sort.sortRules;
                            if (orderBy) {
                                qs.orderBy = orderBy;
                            }
                            if (sortOrder) {
                                qs.sortOrder = sortOrder;
                            }
                        }
                        qs.projection = projection;
                        if (projection === 'custom' && qs.customFieldMask) {
                            qs.customFieldMask = qs.customFieldMask.join(',');
                        }
                        if (output === 'select') {
                            if (!fields.includes('id')) {
                                fields.push('id');
                            }
                            qs.fields = `users(${fields.join(',')})`;
                        }
                        if (!qs.customer) {
                            qs.customer = 'my_customer';
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.googleApiRequestAllItems.call(this, 'users', 'GET', '/directory/v1/users', {}, qs);
                        }
                        else {
                            qs.maxResults = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.googleApiRequest.call(this, 'GET', '/directory/v1/users', {}, qs);
                            responseData = responseData.users;
                        }
                        if (output === 'simplified') {
                            responseData = responseData.map((user) => ({
                                kind: user.kind,
                                id: user.id,
                                primaryEmail: user.primaryEmail,
                                name: user.name,
                                isAdmin: user.isAdmin,
                                lastLoginTime: user.lastLoginTime,
                                creationTime: user.creationTime,
                                suspended: user.suspended,
                            }));
                        }
                    }
                    //https://developers.google.com/admin-sdk/directory/reference/rest/v1/members/delete
                    if (operation === 'removeFromGroup') {
                        const groupId = this.getNodeParameter('groupId', i, undefined, {
                            extractValue: true,
                        });
                        const userId = this.getNodeParameter('userId', i, undefined, {
                            extractValue: true,
                        });
                        await GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/directory/v1/groups/${groupId}/members/${userId}`);
                        responseData = { removed: true };
                    }
                    //https://developers.google.com/admin-sdk/directory/v1/reference/users/update
                    if (operation === 'update') {
                        const userId = this.getNodeParameter('userId', i, undefined, {
                            extractValue: true,
                        });
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        if (updateFields.password) {
                            body.password = updateFields.password;
                        }
                        if (updateFields.changePasswordAtNextLogin !== undefined) {
                            body.changePasswordAtNextLogin = updateFields.changePasswordAtNextLogin;
                        }
                        if (updateFields.firstName) {
                            body.name ??= {};
                            body.name.givenName = updateFields.firstName;
                        }
                        if (updateFields.lastName) {
                            body.name ??= {};
                            body.name.familyName = updateFields.lastName;
                        }
                        if (updateFields.phoneUi) {
                            body.phones = updateFields.phoneUi.phoneValues;
                        }
                        if (updateFields.emailUi) {
                            body.emails = updateFields.emailUi.emailValues;
                        }
                        if (updateFields.primaryEmail) {
                            body.primaryEmail = updateFields.primaryEmail;
                        }
                        if (updateFields.suspendUi) {
                            body.suspended = updateFields.suspendUi;
                        }
                        if (updateFields.roles) {
                            const roles = updateFields.roles;
                            body.roles = {
                                superAdmin: roles.includes('superAdmin'),
                                groupsAdmin: roles.includes('groupsAdmin'),
                                groupsReader: roles.includes('groupsReader'),
                                groupsEditor: roles.includes('groupsEditor'),
                                userManagement: roles.includes('userManagement'),
                                helpDeskAdmin: roles.includes('helpDeskAdmin'),
                                servicesAdmin: roles.includes('servicesAdmin'),
                                inventoryReportingAdmin: roles.includes('inventoryReportingAdmin'),
                                storageAdmin: roles.includes('storageAdmin'),
                                directorySyncAdmin: roles.includes('directorySyncAdmin'),
                                mobileAdmin: roles.includes('mobileAdmin'),
                            };
                        }
                        if (updateFields.customFields) {
                            const customFields = updateFields.customFields
                                .fieldValues;
                            const customSchemas = {};
                            customFields.forEach((field) => {
                                const { schemaName, fieldName, value } = field;
                                if (!schemaName || !fieldName || !value) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid custom field data', {
                                        itemIndex: i,
                                        description: 'Schema name, field name, and value are required.',
                                    });
                                }
                                customSchemas[schemaName] ??= {};
                                customSchemas[schemaName][fieldName] = value;
                            });
                            if (Object.keys(customSchemas).length > 0) {
                                body.customSchemas = customSchemas;
                            }
                        }
                        responseData = await GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/directory/v1/users/${userId}`, body, qs);
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (error instanceof n8n_workflow_1.NodeOperationError) {
                    throw error;
                }
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({
                        message: `Operation "${operation}" failed for resource "${resource}".`,
                        description: error.message,
                    }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Operation "${operation}" failed for resource "${resource}".`, {
                    description: `Please check the input parameters and ensure the API request is correctly formatted. Details: ${error.description}`,
                    itemIndex: i,
                });
            }
        }
        return [returnData];
    }
}
exports.GSuiteAdmin = GSuiteAdmin;
//# sourceMappingURL=GSuiteAdmin.node.js.map
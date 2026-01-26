"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zammad = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class Zammad {
    description = {
        displayName: 'Zammad',
        name: 'zammad',
        icon: 'file:zammad.svg',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume the Zammad API',
        defaults: {
            name: 'Zammad',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'zammadBasicAuthApi',
                required: true,
                testedBy: 'zammadBasicAuthApiTest',
                displayOptions: {
                    show: {
                        authentication: ['basicAuth'],
                    },
                },
            },
            {
                name: 'zammadTokenAuthApi',
                required: true,
                testedBy: 'zammadTokenAuthApiTest',
                displayOptions: {
                    show: {
                        authentication: ['tokenAuth'],
                    },
                },
            },
        ],
        properties: [
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    {
                        name: 'Basic Auth',
                        value: 'basicAuth',
                    },
                    {
                        name: 'Token Auth',
                        value: 'tokenAuth',
                    },
                ],
                default: 'tokenAuth',
            },
            {
                displayName: 'Resource',
                name: 'resource',
                noDataExpression: true,
                type: 'options',
                options: [
                    {
                        name: 'Group',
                        value: 'group',
                    },
                    {
                        name: 'Organization',
                        value: 'organization',
                    },
                    {
                        name: 'Ticket',
                        value: 'ticket',
                    },
                    {
                        name: 'User',
                        value: 'user',
                    },
                ],
                default: 'user',
            },
            ...descriptions_1.groupDescription,
            ...descriptions_1.organizationDescription,
            ...descriptions_1.ticketDescription,
            ...descriptions_1.userDescription,
        ],
    };
    methods = {
        loadOptions: {
            // ----------------------------------
            //          custom fields
            // ----------------------------------
            async loadGroupCustomFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getGroupCustomFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
            },
            async loadOrganizationCustomFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getOrganizationCustomFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
            },
            async loadUserCustomFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getUserCustomFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
            },
            async loadTicketCustomFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getTicketCustomFields)(allFields).map((i) => ({ name: i.name, value: i.id }));
            },
            // ----------------------------------
            //          built-in fields
            // ----------------------------------
            async loadGroupFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getGroupFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
            },
            async loadOrganizationFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getOrganizationFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
            },
            async loadTicketFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getTicketFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
            },
            async loadUserFields() {
                const allFields = await GenericFunctions_1.getAllFields.call(this);
                return (0, GenericFunctions_1.getUserFields)(allFields).map(GenericFunctions_1.fieldToLoadOption);
            },
            // ----------------------------------
            //             resources
            // ----------------------------------
            // by non-ID attribute
            /**
             * POST /tickets requires group name instead of group ID.
             */
            async loadGroupNames() {
                const groups = (await GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/groups'));
                return groups.map((i) => ({ name: i.name, value: i.name }));
            },
            /**
             * PUT /users requires organization name instead of organization ID.
             */
            async loadOrganizationNames() {
                const orgs = (await GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/organizations'));
                return orgs.filter(GenericFunctions_1.isNotZammadFoundation).map((i) => ({ name: i.name, value: i.name }));
            },
            /**
             * POST & PUT /tickets requires customer email instead of customer ID.
             */
            async loadCustomerEmails() {
                const users = (await GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/users'));
                return users.filter(GenericFunctions_1.isCustomer).map((i) => ({ name: i.email, value: i.email }));
            },
            // by ID
            async loadGroups() {
                const groups = (await GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/groups'));
                return groups.map((i) => ({ name: i.name, value: i.id }));
            },
            async loadOrganizations() {
                const orgs = (await GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/organizations'));
                return orgs.filter(GenericFunctions_1.isNotZammadFoundation).map((i) => ({ name: i.name, value: i.id }));
            },
            async loadUsers() {
                const users = (await GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/users'));
                return users.filter(GenericFunctions_1.doesNotBelongToZammad).map((i) => ({ name: i.login, value: i.id }));
            },
        },
        credentialTest: {
            async zammadBasicAuthApiTest(credential) {
                const credentials = credential.data;
                const baseUrl = (0, GenericFunctions_1.tolerateTrailingSlash)(credentials.baseUrl);
                const options = {
                    method: 'GET',
                    uri: `${baseUrl}/api/v1/users/me`,
                    json: true,
                    rejectUnauthorized: !credentials.allowUnauthorizedCerts,
                    auth: {
                        user: credentials.username,
                        pass: credentials.password,
                    },
                };
                try {
                    await this.helpers.request(options);
                    return {
                        status: 'OK',
                        message: 'Authentication successful',
                    };
                }
                catch (error) {
                    return {
                        status: 'Error',
                        message: error.message,
                    };
                }
            },
            async zammadTokenAuthApiTest(credential) {
                const credentials = credential.data;
                const baseUrl = (0, GenericFunctions_1.tolerateTrailingSlash)(credentials.baseUrl);
                const options = {
                    method: 'GET',
                    uri: `${baseUrl}/api/v1/users/me`,
                    json: true,
                    rejectUnauthorized: !credentials.allowUnauthorizedCerts,
                    headers: {
                        Authorization: `Token token=${credentials.accessToken}`,
                    },
                };
                try {
                    await this.helpers.request(options);
                    return {
                        status: 'OK',
                        message: 'Authentication successful',
                    };
                }
                catch (error) {
                    return {
                        status: 'Error',
                        message: error.message,
                    };
                }
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'user') {
                    // **********************************************************************
                    //                                  user
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //           user:create
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/user.html#create
                        const body = {
                            firstname: this.getNodeParameter('firstname', i),
                            lastname: this.getNodeParameter('lastname', i),
                        };
                        const { addressUi, customFieldsUi, ...rest } = this.getNodeParameter('additionalFields', i);
                        Object.assign(body, addressUi?.addressDetails);
                        customFieldsUi?.customFieldPairs.forEach((pair) => {
                            body[pair.name] = pair.value;
                        });
                        Object.assign(body, rest);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/users', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //            user:update
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/user.html#update
                        const id = this.getNodeParameter('id', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (!Object.keys(updateFields).length) {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const { addressUi, customFieldsUi, ...rest } = updateFields;
                        Object.assign(body, addressUi?.addressDetails);
                        customFieldsUi?.customFieldPairs.forEach((pair) => {
                            body[pair.name] = pair.value;
                        });
                        Object.assign(body, rest);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'PUT', `/users/${id}`, body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //            user:delete
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/user.html#delete
                        const id = this.getNodeParameter('id', i);
                        await GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/users/${id}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //            user:get
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/user.html#show
                        const id = this.getNodeParameter('id', i);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/users/${id}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //           user:getAll
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/user.html#list
                        // https://docs.zammad.org/en/latest/api/user.html#search
                        const qs = {};
                        const { sortUi, ...rest } = this.getNodeParameter('filters', i);
                        Object.assign(qs, sortUi?.sortDetails);
                        Object.assign(qs, rest);
                        qs.query ||= ''; // otherwise triggers 500
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                        responseData = await GenericFunctions_1.zammadApiRequestAllItems
                            .call(this, 'GET', '/users/search', {}, qs, limit)
                            .then((response) => {
                            return response.map((user) => {
                                const { _preferences, ...data } = user;
                                return data;
                            });
                        });
                    }
                    else if (operation === 'getSelf') {
                        // ----------------------------------
                        //             user:me
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/user.html#me-current-user
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'GET', '/users/me');
                    }
                }
                else if (resource === 'organization') {
                    // **********************************************************************
                    //                             organization
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //        organization:create
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/organization.html#create
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const { customFieldsUi, ...rest } = this.getNodeParameter('additionalFields', i);
                        customFieldsUi?.customFieldPairs.forEach((pair) => {
                            body[pair.name] = pair.value;
                        });
                        Object.assign(body, rest);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/organizations', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //       organization:update
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/organization.html#update
                        const id = this.getNodeParameter('id', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (!Object.keys(updateFields).length) {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const { customFieldsUi, ...rest } = updateFields;
                        customFieldsUi?.customFieldPairs.forEach((pair) => {
                            body[pair.name] = pair.value;
                        });
                        Object.assign(body, rest);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'PUT', `/organizations/${id}`, body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //         organization:delete
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/organization.html#delete
                        const id = this.getNodeParameter('id', i);
                        await GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/organizations/${id}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //         organization:get
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/organization.html#show
                        const id = this.getNodeParameter('id', i);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/organizations/${id}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //         organization:getAll
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/organization.html#list
                        // https://docs.zammad.org/en/latest/api/organization.html#search - returning empty always
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                        responseData = await GenericFunctions_1.zammadApiRequestAllItems.call(this, 'GET', '/organizations', {}, {}, limit);
                    }
                }
                else if (resource === 'group') {
                    // **********************************************************************
                    //                                  group
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //           group:create
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/group.html#create
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const { customFieldsUi, ...rest } = this.getNodeParameter('additionalFields', i);
                        customFieldsUi?.customFieldPairs.forEach((pair) => {
                            body[pair.name] = pair.value;
                        });
                        Object.assign(body, rest);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/groups', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //            group:update
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/group.html#update
                        const id = this.getNodeParameter('id', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (!Object.keys(updateFields).length) {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const { customFieldsUi, ...rest } = updateFields;
                        customFieldsUi?.customFieldPairs.forEach((pair) => {
                            body[pair.name] = pair.value;
                        });
                        Object.assign(body, rest);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'PUT', `/groups/${id}`, body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //            group:delete
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/group.html#delete
                        const id = this.getNodeParameter('id', i);
                        await GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/groups/${id}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //             group:get
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/group.html#show
                        const id = this.getNodeParameter('id', i);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/groups/${id}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //           group:getAll
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/group.html#list
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                        responseData = await GenericFunctions_1.zammadApiRequestAllItems.call(this, 'GET', '/groups', {}, {}, limit);
                    }
                }
                else if (resource === 'ticket') {
                    // **********************************************************************
                    //                                  ticket
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //           ticket:create
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/ticket/index.html#create
                        const body = {
                            article: {},
                            title: this.getNodeParameter('title', i),
                            group: this.getNodeParameter('group', i),
                            customer: this.getNodeParameter('customer', i),
                        };
                        const article = this.getNodeParameter('article', i);
                        if (!Object.keys(article).length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Article is required', { itemIndex: i });
                        }
                        const { articleDetails: { visibility, ...rest }, } = article;
                        body.article = {
                            ...rest,
                            internal: visibility === 'internal',
                        };
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'POST', '/tickets', body);
                        const { id } = responseData;
                        responseData.articles = await GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/ticket_articles/by_ticket/${id}`);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //          ticket:delete
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/ticket/index.html#delete
                        const id = this.getNodeParameter('id', i);
                        await GenericFunctions_1.zammadApiRequest.call(this, 'DELETE', `/tickets/${id}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //            ticket:get
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/ticket/index.html#show
                        const id = this.getNodeParameter('id', i);
                        responseData = await GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/tickets/${id}`);
                        responseData.articles = await GenericFunctions_1.zammadApiRequest.call(this, 'GET', `/ticket_articles/by_ticket/${id}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //           ticket:getAll
                        // ----------------------------------
                        // https://docs.zammad.org/en/latest/api/ticket/index.html#list
                        // https://docs.zammad.org/en/latest/api/ticket/index.html#search - returning empty always
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                        responseData = await GenericFunctions_1.zammadApiRequestAllItems.call(this, 'GET', '/tickets', {}, {}, limit);
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Zammad = Zammad;
//# sourceMappingURL=Zammad.node.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ldap = void 0;
const ldapts_1 = require("ldapts");
const n8n_workflow_1 = require("n8n-workflow");
const Helpers_1 = require("./Helpers");
const LdapDescription_1 = require("./LdapDescription");
class Ldap {
    description = {
        displayName: 'Ldap',
        name: 'ldap',
        icon: { light: 'file:ldap.svg', dark: 'file:ldap.dark.svg' },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with LDAP servers',
        defaults: {
            name: 'LDAP',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                // eslint-disable-next-line n8n-nodes-base/node-class-description-credentials-name-unsuffixed
                name: 'ldap',
                required: true,
                testedBy: 'ldapConnectionTest',
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Compare',
                        value: 'compare',
                        description: 'Compare an attribute',
                        action: 'Compare an attribute',
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new entry',
                        action: 'Create a new entry',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete an entry',
                        action: 'Delete an entry',
                    },
                    {
                        name: 'Rename',
                        value: 'rename',
                        description: 'Rename the DN of an existing entry',
                        action: 'Rename the DN of an existing entry',
                    },
                    {
                        name: 'Search',
                        value: 'search',
                        description: 'Search LDAP',
                        action: 'Search LDAP',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update attributes',
                        action: 'Update attributes',
                    },
                ],
                default: 'search',
            },
            {
                displayName: 'Debug',
                name: 'nodeDebug',
                type: 'boolean',
                isNodeSetting: true,
                default: false,
                noDataExpression: true,
            },
            ...LdapDescription_1.ldapFields,
        ],
    };
    methods = {
        credentialTest: {
            async ldapConnectionTest(credential) {
                const credentials = credential.data;
                const client = await (0, Helpers_1.createLdapClient)(this, credentials);
                try {
                    await client.bind(credentials.bindDN, credentials.bindPassword);
                }
                catch (error) {
                    return {
                        status: 'Error',
                        message: error.message,
                    };
                }
                finally {
                    await client.unbind();
                }
                return {
                    status: 'OK',
                    message: 'Connection successful!',
                };
            },
        },
        loadOptions: {
            async getAttributes() {
                const credentials = await this.getCredentials('ldap');
                const client = await (0, Helpers_1.createLdapClient)(this, credentials);
                try {
                    await client.bind(credentials.bindDN, credentials.bindPassword);
                }
                catch (error) {
                    await client.unbind();
                    this.logger.error(error);
                    return [];
                }
                let results;
                const baseDN = this.getNodeParameter('baseDN', 0);
                try {
                    results = await client.search(baseDN, { sizeLimit: 200, paged: false }); // should this size limit be set in credentials?
                }
                catch (error) {
                    this.logger.error(error);
                    return [];
                }
                finally {
                    await client.unbind();
                }
                const unique = Object.keys(Object.assign({}, ...results.searchEntries));
                return unique.map((x) => ({
                    name: x,
                    value: x,
                }));
            },
            async getObjectClasses() {
                const credentials = await this.getCredentials('ldap');
                const client = await (0, Helpers_1.createLdapClient)(this, credentials);
                try {
                    await client.bind(credentials.bindDN, credentials.bindPassword);
                }
                catch (error) {
                    await client.unbind();
                    this.logger.error(error);
                    return [];
                }
                const baseDN = this.getNodeParameter('baseDN', 0);
                let results;
                try {
                    results = await client.search(baseDN, { sizeLimit: 10, paged: false }); // should this size limit be set in credentials?
                }
                catch (error) {
                    this.logger.error(error);
                    return [];
                }
                finally {
                    await client.unbind();
                }
                const objects = [];
                for (const entry of results.searchEntries) {
                    if (typeof entry.objectClass === 'string') {
                        objects.push(entry.objectClass);
                    }
                    else {
                        objects.push(...entry.objectClass);
                    }
                }
                const unique = [...new Set(objects)];
                unique.push('custom');
                const result = [];
                for (const value of unique) {
                    if (value === 'custom') {
                        result.push({ name: 'custom', value: 'custom' });
                    }
                    else
                        result.push({ name: value, value: `(objectclass=${value})` });
                }
                return result;
            },
            async getAttributesForDn() {
                const credentials = await this.getCredentials('ldap');
                const client = await (0, Helpers_1.createLdapClient)(this, credentials);
                try {
                    await client.bind(credentials.bindDN, credentials.bindPassword);
                }
                catch (error) {
                    await client.unbind();
                    this.logger.error(error);
                    return [];
                }
                let results;
                const baseDN = this.getNodeParameter('dn', 0);
                try {
                    results = await client.search(baseDN, { sizeLimit: 1, paged: false });
                }
                catch (error) {
                    this.logger.error(error);
                    return [];
                }
                finally {
                    await client.unbind();
                }
                const unique = Object.keys(Object.assign({}, ...results.searchEntries));
                return unique.map((x) => ({
                    name: x,
                    value: x,
                }));
            },
        },
    };
    async execute() {
        const nodeDebug = this.getNodeParameter('nodeDebug', 0);
        const items = this.getInputData();
        const returnItems = [];
        if (nodeDebug) {
            this.logger.info(`[${this.getNode().type} | ${this.getNode().name}] - Starting with ${items.length} input items`);
        }
        const credentials = await this.getCredentials('ldap');
        const client = await (0, Helpers_1.createLdapClient)(this, credentials, nodeDebug, this.getNode().type, this.getNode().name);
        try {
            await client.bind(credentials.bindDN, credentials.bindPassword);
        }
        catch (error) {
            delete error.cert;
            await client.unbind();
            if (this.continueOnFail()) {
                return [
                    items.map((x) => {
                        x.json.error = error.reason || 'LDAP connection error occurred';
                        return x;
                    }),
                ];
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {});
            }
        }
        const operation = this.getNodeParameter('operation', 0);
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                if (operation === 'compare') {
                    const dn = this.getNodeParameter('dn', itemIndex);
                    const attributeId = this.getNodeParameter('id', itemIndex);
                    const value = this.getNodeParameter('value', itemIndex, '');
                    const res = await client.compare(dn, attributeId, value);
                    returnItems.push({
                        json: { dn, attribute: attributeId, result: res },
                        pairedItem: { item: itemIndex },
                    });
                }
                else if (operation === 'create') {
                    const dn = this.getNodeParameter('dn', itemIndex);
                    const attributeFields = this.getNodeParameter('attributes', itemIndex);
                    const attributes = {};
                    if (Object.keys(attributeFields).length) {
                        //@ts-ignore
                        attributeFields.attribute.map((attr) => {
                            attributes[attr.id] = attr.value;
                        });
                    }
                    await client.add(dn, attributes);
                    returnItems.push({
                        json: { dn, result: 'success' },
                        pairedItem: { item: itemIndex },
                    });
                }
                else if (operation === 'delete') {
                    const dn = this.getNodeParameter('dn', itemIndex);
                    await client.del(dn);
                    returnItems.push({
                        json: { dn, result: 'success' },
                        pairedItem: { item: itemIndex },
                    });
                }
                else if (operation === 'rename') {
                    const dn = this.getNodeParameter('dn', itemIndex);
                    const targetDn = this.getNodeParameter('targetDn', itemIndex);
                    await client.modifyDN(dn, targetDn);
                    returnItems.push({
                        json: { dn: targetDn, result: 'success' },
                        pairedItem: { item: itemIndex },
                    });
                }
                else if (operation === 'update') {
                    const dn = this.getNodeParameter('dn', itemIndex);
                    const attributes = this.getNodeParameter('attributes', itemIndex, {});
                    const changes = [];
                    for (const [action, attrs] of Object.entries(attributes)) {
                        //@ts-ignore
                        attrs.map((attr) => changes.push(new ldapts_1.Change({
                            // @ts-ignore
                            operation: action,
                            modification: new ldapts_1.Attribute({
                                type: attr.id,
                                values: [attr.value],
                            }),
                        })));
                    }
                    await client.modify(dn, changes);
                    returnItems.push({
                        json: { dn, result: 'success', changes },
                        pairedItem: { item: itemIndex },
                    });
                }
                else if (operation === 'search') {
                    const baseDN = this.getNodeParameter('baseDN', itemIndex);
                    let searchFor = this.getNodeParameter('searchFor', itemIndex);
                    const returnAll = this.getNodeParameter('returnAll', itemIndex);
                    const limit = this.getNodeParameter('limit', itemIndex, 0);
                    const options = this.getNodeParameter('options', itemIndex);
                    const pageSize = this.getNodeParameter('options.pageSize', itemIndex, 1000);
                    // Set paging settings
                    delete options.pageSize;
                    options.sizeLimit = returnAll ? 0 : limit;
                    if (pageSize) {
                        options.paged = { pageSize };
                    }
                    // Set attributes to retrieve
                    if (typeof options.attributes === 'string') {
                        options.attributes = options.attributes.split(',').map((attribute) => attribute.trim());
                    }
                    options.explicitBufferAttributes = Helpers_1.BINARY_AD_ATTRIBUTES;
                    if (searchFor === 'custom') {
                        searchFor = this.getNodeParameter('customFilter', itemIndex);
                    }
                    else {
                        const searchText = this.getNodeParameter('searchText', itemIndex);
                        const attribute = this.getNodeParameter('attribute', itemIndex);
                        searchFor = `(&${searchFor}(${attribute}=${searchText}))`;
                    }
                    // Replace escaped filter special chars for ease of use
                    // Character       ASCII value
                    // ---------------------------
                    // *               0x2a
                    // (               0x28
                    // )               0x29
                    // \               0x5c
                    searchFor = searchFor.replace(/\\\\/g, '\\5c');
                    searchFor = searchFor.replace(/\\\*/g, '\\2a');
                    searchFor = searchFor.replace(/\\\(/g, '\\28');
                    searchFor = searchFor.replace(/\\\)/g, '\\29');
                    options.filter = searchFor;
                    if (nodeDebug) {
                        this.logger.info(`[${this.getNode().type} | ${this.getNode().name}] - Search Options ${JSON.stringify(options, null, 2)}`);
                    }
                    const results = await client.search(baseDN, options);
                    // Not all LDAP servers respect the sizeLimit
                    if (!returnAll) {
                        results.searchEntries = results.searchEntries.slice(0, limit);
                    }
                    (0, Helpers_1.resolveBinaryAttributes)(results.searchEntries);
                    returnItems.push.apply(returnItems, results.searchEntries.map((result) => ({
                        json: result,
                        pairedItem: { item: itemIndex },
                    })));
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnItems.push({ json: items[itemIndex].json, error, pairedItem: itemIndex });
                }
                else {
                    await client.unbind();
                    if (error.context) {
                        error.context.itemIndex = itemIndex;
                        throw error;
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex,
                    });
                }
            }
        }
        if (nodeDebug) {
            this.logger.info(`[${this.getNode().type} | ${this.getNode().name}] - Finished`);
        }
        await client.unbind();
        return [returnItems];
    }
}
exports.Ldap = Ldap;
//# sourceMappingURL=Ldap.node.js.map
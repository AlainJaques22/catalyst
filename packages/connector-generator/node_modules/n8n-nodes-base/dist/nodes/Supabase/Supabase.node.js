"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supabase = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const RowDescription_1 = require("./RowDescription");
class Supabase {
    description = {
        displayName: 'Supabase',
        name: 'supabase',
        icon: 'file:supabase.svg',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Add, get, delete and update data in a table',
        defaults: {
            name: 'Supabase',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'supabaseApi',
                required: true,
                testedBy: 'supabaseApiCredentialTest',
            },
        ],
        hints: [
            {
                type: 'info',
                message: 'Note on using an expression for Schema: It will be evaluated only once, so all items will use the <em>same</em> document. It will be calculated by evaluating the expression for the <strong>first input item</strong>.',
                displayCondition: '={{ $rawParameter.schema?.startsWith("=") && $input.all().length > 1 }}',
                whenToDisplay: 'always',
                location: 'outputPane',
            },
        ],
        properties: [
            {
                displayName: 'Use Custom Schema',
                name: 'useCustomSchema',
                type: 'boolean',
                default: false,
                noDataExpression: true,
                description: 'Whether to use a database schema different from the default "public" schema (requires schema exposure in the <a href="https://supabase.com/docs/guides/api/using-custom-schemas?queryGroups=language&language=curl#exposing-custom-schemas">Supabase API</a>)',
            },
            {
                displayName: 'Schema',
                name: 'schema',
                type: 'string',
                default: 'public',
                description: 'Name of database schema to use for table',
                noDataExpression: false,
                displayOptions: { show: { useCustomSchema: [true] } },
            },
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Row',
                        value: 'row',
                    },
                ],
                default: 'row',
            },
            ...RowDescription_1.rowOperations,
            ...RowDescription_1.rowFields,
        ],
    };
    methods = {
        loadOptions: {
            async getTables() {
                const returnData = [];
                const header = (0, GenericFunctions_1.getSchemaHeader)(this, 'GET', 'loadOptions');
                const { paths } = await GenericFunctions_1.supabaseApiRequest.call(this, 'GET', '/', {}, {}, undefined, header);
                for (const path of Object.keys(paths)) {
                    //omit introspection path
                    if (path === '/')
                        continue;
                    returnData.push({
                        name: path.replace('/', ''),
                        value: path.replace('/', ''),
                    });
                }
                return returnData;
            },
            async getTableColumns() {
                const returnData = [];
                const tableName = this.getCurrentNodeParameter('tableId');
                const header = (0, GenericFunctions_1.getSchemaHeader)(this, 'GET', 'loadOptions');
                const { definitions } = await GenericFunctions_1.supabaseApiRequest.call(this, 'GET', '/', {}, {}, undefined, header);
                for (const column of Object.keys(definitions[tableName].properties)) {
                    returnData.push({
                        name: `${column} - (${definitions[tableName].properties[column].type})`,
                        value: column,
                    });
                }
                return returnData;
            },
        },
        credentialTest: {
            async supabaseApiCredentialTest(credential) {
                try {
                    await GenericFunctions_1.validateCredentials.call(this, credential.data);
                }
                catch (error) {
                    return {
                        status: 'Error',
                        message: 'The Service Key is invalid',
                    };
                }
                return {
                    status: 'OK',
                    message: 'Connection successful!',
                };
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        let qs = {};
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        if (resource === 'row') {
            const tableId = this.getNodeParameter('tableId', 0);
            if (operation === 'create') {
                const records = [];
                const header = (0, GenericFunctions_1.getSchemaHeader)(this, 'POST', 'execute');
                for (let i = 0; i < length; i++) {
                    const record = {};
                    const dataToSend = this.getNodeParameter('dataToSend', 0);
                    if (dataToSend === 'autoMapInputData') {
                        const incomingKeys = Object.keys(items[i].json);
                        const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                        const inputDataToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());
                        for (const key of incomingKeys) {
                            if (inputDataToIgnore.includes(key))
                                continue;
                            record[key] = items[i].json[key];
                        }
                    }
                    else {
                        const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                        for (const field of fields) {
                            record[`${field.fieldId}`] = field.fieldValue;
                        }
                    }
                    records.push(record);
                }
                const endpoint = `/${tableId}`;
                try {
                    const createdRows = await GenericFunctions_1.supabaseApiRequest.call(this, 'POST', endpoint, records, {}, undefined, header);
                    createdRows.forEach((row, i) => {
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(row), { itemData: { item: i } });
                        returnData.push(...executionData);
                    });
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.description }), { itemData: (0, GenericFunctions_1.mapPairedItemsFrom)(records) });
                        returnData.push(...executionData);
                    }
                    else {
                        throw error;
                    }
                }
            }
            if (operation === 'delete') {
                const filterType = this.getNodeParameter('filterType', 0);
                const header = (0, GenericFunctions_1.getSchemaHeader)(this, 'DELETE', 'execute');
                for (let i = 0; i < length; i++) {
                    let endpoint = `/${tableId}`;
                    if (filterType === 'manual') {
                        const matchType = this.getNodeParameter('matchType', 0);
                        const keys = this.getNodeParameter('filters.conditions', i, []);
                        if (!keys.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one select condition must be defined', { itemIndex: i });
                        }
                        if (matchType === 'allFilters') {
                            const data = keys.reduce((obj, value) => (0, GenericFunctions_1.buildQuery)(obj, value), {});
                            Object.assign(qs, data);
                        }
                        if (matchType === 'anyFilter') {
                            const data = keys.map((key) => (0, GenericFunctions_1.buildOrQuery)(key));
                            Object.assign(qs, { or: `(${data.join(',')})` });
                        }
                    }
                    if (filterType === 'string') {
                        const filterString = this.getNodeParameter('filterString', i);
                        endpoint = `${endpoint}?${encodeURI(filterString)}`;
                    }
                    let rows;
                    try {
                        rows = await GenericFunctions_1.supabaseApiRequest.call(this, 'DELETE', endpoint, {}, qs, undefined, header);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.description }), { itemData: { item: i } });
                            returnData.push(...executionData);
                            continue;
                        }
                        throw error;
                    }
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(rows), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
            }
            if (operation === 'get') {
                const endpoint = `/${tableId}`;
                const header = (0, GenericFunctions_1.getSchemaHeader)(this, 'GET', 'execute');
                for (let i = 0; i < length; i++) {
                    const keys = this.getNodeParameter('filters.conditions', i, []);
                    const data = keys.reduce((obj, value) => (0, GenericFunctions_1.buildGetQuery)(obj, value), {});
                    Object.assign(qs, data);
                    let rows;
                    if (!keys.length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one select condition must be defined', { itemIndex: i });
                    }
                    try {
                        rows = await GenericFunctions_1.supabaseApiRequest.call(this, 'GET', endpoint, {}, qs, undefined, header);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                            returnData.push(...executionData);
                            continue;
                        }
                        throw error;
                    }
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(rows), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
            }
            if (operation === 'getAll') {
                const returnAll = this.getNodeParameter('returnAll', 0);
                const filterType = this.getNodeParameter('filterType', 0);
                const header = (0, GenericFunctions_1.getSchemaHeader)(this, 'GET', 'execute');
                let endpoint = `/${tableId}`;
                for (let i = 0; i < length; i++) {
                    qs = {}; // reset qs
                    if (filterType === 'manual') {
                        const matchType = this.getNodeParameter('matchType', 0);
                        const keys = this.getNodeParameter('filters.conditions', i, []);
                        if (keys.length !== 0) {
                            if (matchType === 'allFilters') {
                                const data = keys.map((key) => (0, GenericFunctions_1.buildOrQuery)(key));
                                Object.assign(qs, { and: `(${data.join(',')})` });
                            }
                            if (matchType === 'anyFilter') {
                                const data = keys.map((key) => (0, GenericFunctions_1.buildOrQuery)(key));
                                Object.assign(qs, { or: `(${data.join(',')})` });
                            }
                        }
                    }
                    if (filterType === 'string') {
                        const filterString = this.getNodeParameter('filterString', i);
                        endpoint = `${endpoint}?${encodeURI(filterString)}`;
                    }
                    if (!returnAll) {
                        qs.limit = this.getNodeParameter('limit', 0);
                    }
                    let rows = [];
                    try {
                        let responseLength = 0;
                        do {
                            const newRows = await GenericFunctions_1.supabaseApiRequest.call(this, 'GET', endpoint, {}, qs, undefined, header);
                            responseLength = newRows.length;
                            rows = rows.concat(newRows);
                            qs.offset = rows.length;
                        } while (responseLength >= 1000);
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(rows), { itemData: { item: i } });
                        returnData.push(...executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.description }), { itemData: { item: i } });
                            returnData.push(...executionData);
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'update') {
                const filterType = this.getNodeParameter('filterType', 0);
                let endpoint = `/${tableId}`;
                const header = (0, GenericFunctions_1.getSchemaHeader)(this, 'PATCH', 'execute');
                for (let i = 0; i < length; i++) {
                    if (filterType === 'manual') {
                        const matchType = this.getNodeParameter('matchType', 0);
                        const keys = this.getNodeParameter('filters.conditions', i, []);
                        if (!keys.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one select condition must be defined', { itemIndex: i });
                        }
                        if (matchType === 'allFilters') {
                            const data = keys.reduce((obj, value) => (0, GenericFunctions_1.buildQuery)(obj, value), {});
                            Object.assign(qs, data);
                        }
                        if (matchType === 'anyFilter') {
                            const data = keys.map((key) => (0, GenericFunctions_1.buildOrQuery)(key));
                            Object.assign(qs, { or: `(${data.join(',')})` });
                        }
                    }
                    if (filterType === 'string') {
                        const filterString = this.getNodeParameter('filterString', i);
                        endpoint = `${endpoint}?${encodeURI(filterString)}`;
                    }
                    const record = {};
                    const dataToSend = this.getNodeParameter('dataToSend', 0);
                    if (dataToSend === 'autoMapInputData') {
                        const incomingKeys = Object.keys(items[i].json);
                        const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                        const inputDataToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());
                        for (const key of incomingKeys) {
                            if (inputDataToIgnore.includes(key))
                                continue;
                            record[key] = items[i].json[key];
                        }
                    }
                    else {
                        const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                        for (const field of fields) {
                            record[`${field.fieldId}`] = field.fieldValue;
                        }
                    }
                    let updatedRow;
                    try {
                        updatedRow = await GenericFunctions_1.supabaseApiRequest.call(this, 'PATCH', endpoint, record, qs, undefined, header);
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(updatedRow), { itemData: { item: i } });
                        returnData.push(...executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.description }), { itemData: { item: i } });
                            returnData.push(...executionData);
                            continue;
                        }
                        throw error;
                    }
                }
            }
        }
        return [returnData];
    }
}
exports.Supabase = Supabase;
//# sourceMappingURL=Supabase.node.js.map
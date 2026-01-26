"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Baserow = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const OperationDescription_1 = require("./OperationDescription");
class Baserow {
    description = {
        displayName: 'Baserow',
        name: 'baserow',
        icon: 'file:baserow.svg',
        group: ['output'],
        version: 1,
        description: 'Consume the Baserow API',
        subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
        defaults: {
            name: 'Baserow',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'baserowApi',
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
                        name: 'Row',
                        value: 'row',
                    },
                ],
                default: 'row',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['row'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a row',
                        action: 'Create a row',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete a row',
                        action: 'Delete a row',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Retrieve a row',
                        action: 'Get a row',
                    },
                    {
                        name: 'Get Many',
                        value: 'getAll',
                        description: 'Retrieve many rows',
                        action: 'Get many rows',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update a row',
                        action: 'Update a row',
                    },
                ],
                default: 'getAll',
            },
            ...OperationDescription_1.operationFields,
        ],
    };
    methods = {
        loadOptions: {
            async getDatabaseIds() {
                const credentials = await this.getCredentials('baserowApi');
                const jwtToken = await GenericFunctions_1.getJwtToken.call(this, credentials);
                const endpoint = '/api/applications/';
                const databases = (await GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, jwtToken));
                // Baserow has different types of applications, we only want the databases
                // https://api.baserow.io/api/redoc/#tag/Applications/operation/list_all_applications
                return (0, GenericFunctions_1.toOptions)(databases.filter((database) => database.type === 'database'));
            },
            async getTableIds() {
                const credentials = await this.getCredentials('baserowApi');
                const jwtToken = await GenericFunctions_1.getJwtToken.call(this, credentials);
                const databaseId = this.getNodeParameter('databaseId', 0);
                const endpoint = `/api/database/tables/database/${databaseId}/`;
                const tables = (await GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, jwtToken));
                return (0, GenericFunctions_1.toOptions)(tables);
            },
            async getTableFields() {
                const credentials = await this.getCredentials('baserowApi');
                const jwtToken = await GenericFunctions_1.getJwtToken.call(this, credentials);
                const tableId = this.getNodeParameter('tableId', 0);
                const endpoint = `/api/database/fields/table/${tableId}/`;
                const fields = (await GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, jwtToken));
                return (0, GenericFunctions_1.toOptions)(fields);
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const mapper = new GenericFunctions_1.TableFieldMapper();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        const tableId = this.getNodeParameter('tableId', 0);
        const credentials = await this.getCredentials('baserowApi');
        const jwtToken = await GenericFunctions_1.getJwtToken.call(this, credentials);
        const fields = await mapper.getTableFields.call(this, tableId, jwtToken);
        mapper.createMappings(fields);
        for (let i = 0; i < items.length; i++) {
            try {
                if (operation === 'getAll') {
                    // ----------------------------------
                    //             getAll
                    // ----------------------------------
                    // https://api.baserow.io/api/redoc/#operation/list_database_table_rows
                    const { order, filters, filterType, search } = this.getNodeParameter('additionalOptions', i);
                    const qs = {};
                    if (order?.fields) {
                        qs.order_by = order.fields
                            .map(({ field, direction }) => `${direction}${mapper.setField(field)}`)
                            .join(',');
                    }
                    if (filters?.fields) {
                        filters.fields.forEach(({ field, operator, value }) => {
                            qs[`filter__field_${mapper.setField(field)}__${operator}`] = value;
                        });
                    }
                    if (filterType) {
                        qs.filter_type = filterType;
                    }
                    if (search) {
                        qs.search = search;
                    }
                    const endpoint = `/api/database/rows/table/${tableId}/`;
                    const rows = (await GenericFunctions_1.baserowApiRequestAllItems.call(this, 'GET', endpoint, jwtToken, {}, qs));
                    rows.forEach((row) => mapper.idsToNames(row));
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(rows), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
                else if (operation === 'get') {
                    // ----------------------------------
                    //             get
                    // ----------------------------------
                    // https://api.baserow.io/api/redoc/#operation/get_database_table_row
                    const rowId = this.getNodeParameter('rowId', i);
                    const endpoint = `/api/database/rows/table/${tableId}/${rowId}/`;
                    const row = await GenericFunctions_1.baserowApiRequest.call(this, 'GET', endpoint, jwtToken);
                    mapper.idsToNames(row);
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(row), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
                else if (operation === 'create') {
                    // ----------------------------------
                    //             create
                    // ----------------------------------
                    // https://api.baserow.io/api/redoc/#operation/create_database_table_row
                    const body = {};
                    const dataToSend = this.getNodeParameter('dataToSend', 0);
                    if (dataToSend === 'autoMapInputData') {
                        const incomingKeys = Object.keys(items[i].json);
                        const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                        const inputDataToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());
                        for (const key of incomingKeys) {
                            if (inputDataToIgnore.includes(key))
                                continue;
                            body[key] = items[i].json[key];
                            mapper.namesToIds(body);
                        }
                    }
                    else {
                        const fieldsUi = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                        for (const field of fieldsUi) {
                            body[`field_${field.fieldId}`] = field.fieldValue;
                        }
                    }
                    const endpoint = `/api/database/rows/table/${tableId}/`;
                    const createdRow = await GenericFunctions_1.baserowApiRequest.call(this, 'POST', endpoint, jwtToken, body);
                    mapper.idsToNames(createdRow);
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(createdRow), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
                else if (operation === 'update') {
                    // ----------------------------------
                    //             update
                    // ----------------------------------
                    // https://api.baserow.io/api/redoc/#operation/update_database_table_row
                    const rowId = this.getNodeParameter('rowId', i);
                    const body = {};
                    const dataToSend = this.getNodeParameter('dataToSend', 0);
                    if (dataToSend === 'autoMapInputData') {
                        const incomingKeys = Object.keys(items[i].json);
                        const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                        const inputsToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());
                        for (const key of incomingKeys) {
                            if (inputsToIgnore.includes(key))
                                continue;
                            body[key] = items[i].json[key];
                            mapper.namesToIds(body);
                        }
                    }
                    else {
                        const fieldsUi = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                        for (const field of fieldsUi) {
                            body[`field_${field.fieldId}`] = field.fieldValue;
                        }
                    }
                    const endpoint = `/api/database/rows/table/${tableId}/${rowId}/`;
                    const updatedRow = await GenericFunctions_1.baserowApiRequest.call(this, 'PATCH', endpoint, jwtToken, body);
                    mapper.idsToNames(updatedRow);
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(updatedRow), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
                else if (operation === 'delete') {
                    // ----------------------------------
                    //             delete
                    // ----------------------------------
                    // https://api.baserow.io/api/redoc/#operation/delete_database_table_row
                    const rowId = this.getNodeParameter('rowId', i);
                    const endpoint = `/api/database/rows/table/${tableId}/${rowId}/`;
                    await GenericFunctions_1.baserowApiRequest.call(this, 'DELETE', endpoint, jwtToken);
                    const executionData = this.helpers.constructExecutionMetaData([{ json: { success: true } }], { itemData: { item: i } });
                    returnData.push(...executionData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message, json: {}, itemIndex: i });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Baserow = Baserow;
//# sourceMappingURL=Baserow.node.js.map
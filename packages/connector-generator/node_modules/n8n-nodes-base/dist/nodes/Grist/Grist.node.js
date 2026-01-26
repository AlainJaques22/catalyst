"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grist = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const OperationDescription_1 = require("./OperationDescription");
class Grist {
    description = {
        displayName: 'Grist',
        name: 'grist',
        icon: 'file:grist.svg',
        subtitle: '={{$parameter["operation"]}}',
        group: ['input'],
        version: 1,
        description: 'Consume the Grist API',
        defaults: {
            name: 'Grist',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'gristApi',
                required: true,
                testedBy: 'gristApiTest',
            },
        ],
        properties: OperationDescription_1.operationFields,
    };
    methods = {
        loadOptions: {
            async getTableColumns() {
                const docId = this.getNodeParameter('docId', 0);
                const tableId = this.getNodeParameter('tableId', 0);
                const endpoint = `/docs/${docId}/tables/${tableId}/columns`;
                const { columns } = (await GenericFunctions_1.gristApiRequest.call(this, 'GET', endpoint));
                return columns.map(({ id }) => ({ name: id, value: id }));
            },
        },
        credentialTest: {
            async gristApiTest(credential) {
                const { apiKey, planType, customSubdomain, selfHostedUrl } = credential.data;
                const endpoint = '/orgs';
                const gristapiurl = planType === 'free'
                    ? `https://docs.getgrist.com/api${endpoint}`
                    : planType === 'paid'
                        ? `https://${customSubdomain}.getgrist.com/api${endpoint}`
                        : `${selfHostedUrl}/api${endpoint}`;
                const options = {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                    method: 'GET',
                    uri: gristapiurl,
                    qs: { limit: 1 },
                    json: true,
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
        let responseData;
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                if (operation === 'create') {
                    // ----------------------------------
                    //             create
                    // ----------------------------------
                    // https://support.getgrist.com/api/#tag/records/paths/~1docs~1{docId}~1tables~1{tableId}~1records/post
                    const body = { records: [] };
                    const dataToSend = this.getNodeParameter('dataToSend', 0);
                    if (dataToSend === 'autoMapInputs') {
                        const incomingKeys = Object.keys(items[i].json);
                        const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                        const inputsToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());
                        const fields = (0, GenericFunctions_1.parseAutoMappedInputs)(incomingKeys, inputsToIgnore, items[i].json);
                        body.records.push({ fields });
                    }
                    else if (dataToSend === 'defineInNode') {
                        const { properties } = this.getNodeParameter('fieldsToSend', i, []);
                        GenericFunctions_1.throwOnZeroDefinedFields.call(this, properties);
                        body.records.push({ fields: (0, GenericFunctions_1.parseDefinedFields)(properties) });
                    }
                    const docId = this.getNodeParameter('docId', 0);
                    const tableId = this.getNodeParameter('tableId', 0);
                    const endpoint = `/docs/${docId}/tables/${tableId}/records`;
                    responseData = await GenericFunctions_1.gristApiRequest.call(this, 'POST', endpoint, body);
                    responseData = {
                        id: responseData.records[0].id,
                        ...body.records[0].fields,
                    };
                }
                else if (operation === 'delete') {
                    // ----------------------------------
                    //            delete
                    // ----------------------------------
                    // https://support.getgrist.com/api/#tag/data/paths/~1docs~1{docId}~1tables~1{tableId}~1data~1delete/post
                    const docId = this.getNodeParameter('docId', 0);
                    const tableId = this.getNodeParameter('tableId', 0);
                    const endpoint = `/docs/${docId}/tables/${tableId}/data/delete`;
                    const rawRowIds = this.getNodeParameter('rowId', i).toString();
                    const body = rawRowIds
                        .split(',')
                        .map((c) => c.trim())
                        .map(Number);
                    await GenericFunctions_1.gristApiRequest.call(this, 'POST', endpoint, body);
                    responseData = { success: true };
                }
                else if (operation === 'update') {
                    // ----------------------------------
                    //            update
                    // ----------------------------------
                    // https://support.getgrist.com/api/#tag/records/paths/~1docs~1{docId}~1tables~1{tableId}~1records/patch
                    const body = { records: [] };
                    const rowId = this.getNodeParameter('rowId', i);
                    const dataToSend = this.getNodeParameter('dataToSend', 0);
                    if (dataToSend === 'autoMapInputs') {
                        const incomingKeys = Object.keys(items[i].json);
                        const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                        const inputsToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());
                        const fields = (0, GenericFunctions_1.parseAutoMappedInputs)(incomingKeys, inputsToIgnore, items[i].json);
                        body.records.push({ id: Number(rowId), fields });
                    }
                    else if (dataToSend === 'defineInNode') {
                        const { properties } = this.getNodeParameter('fieldsToSend', i, []);
                        GenericFunctions_1.throwOnZeroDefinedFields.call(this, properties);
                        const fields = (0, GenericFunctions_1.parseDefinedFields)(properties);
                        body.records.push({ id: Number(rowId), fields });
                    }
                    const docId = this.getNodeParameter('docId', 0);
                    const tableId = this.getNodeParameter('tableId', 0);
                    const endpoint = `/docs/${docId}/tables/${tableId}/records`;
                    await GenericFunctions_1.gristApiRequest.call(this, 'PATCH', endpoint, body);
                    responseData = {
                        id: rowId,
                        ...body.records[0].fields,
                    };
                }
                else if (operation === 'getAll') {
                    // ----------------------------------
                    //             getAll
                    // ----------------------------------
                    // https://support.getgrist.com/api/#tag/records
                    const docId = this.getNodeParameter('docId', 0);
                    const tableId = this.getNodeParameter('tableId', 0);
                    const endpoint = `/docs/${docId}/tables/${tableId}/records`;
                    const qs = {};
                    const returnAll = this.getNodeParameter('returnAll', i);
                    if (!returnAll) {
                        qs.limit = this.getNodeParameter('limit', i);
                    }
                    const { sort, filter } = this.getNodeParameter('additionalOptions', i);
                    if (sort?.sortProperties.length) {
                        qs.sort = (0, GenericFunctions_1.parseSortProperties)(sort.sortProperties);
                    }
                    if (filter?.filterProperties.length) {
                        const parsed = (0, GenericFunctions_1.parseFilterProperties)(filter.filterProperties);
                        qs.filter = JSON.stringify(parsed);
                    }
                    responseData = await GenericFunctions_1.gristApiRequest.call(this, 'GET', endpoint, {}, qs);
                    responseData = responseData.records.map((data) => {
                        return { id: data.id, ...data.fields };
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionData);
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
exports.Grist = Grist;
//# sourceMappingURL=Grist.node.js.map
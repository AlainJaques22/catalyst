"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERPNext = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const DocumentDescription_1 = require("./DocumentDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const utils_1 = require("./utils");
class ERPNext {
    description = {
        displayName: 'ERPNext',
        name: 'erpNext',
        icon: 'file:erpnext.svg',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
        description: 'Consume ERPNext API',
        defaults: {
            name: 'ERPNext',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'erpNextApi',
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
                        name: 'Document',
                        value: 'document',
                    },
                ],
                default: 'document',
            },
            ...DocumentDescription_1.documentOperations,
            ...DocumentDescription_1.documentFields,
        ],
    };
    methods = {
        loadOptions: {
            async getDocTypes() {
                const data = await GenericFunctions_1.erpNextApiRequestAllItems.call(this, 'data', 'GET', '/api/resource/DocType', {});
                const docTypes = data.map(({ name }) => {
                    return { name, value: encodeURI(name) };
                });
                return (0, utils_1.processNames)(docTypes);
            },
            async getDocFilters() {
                const docType = this.getCurrentNodeParameter('docType');
                const { data } = await GenericFunctions_1.erpNextApiRequest.call(this, 'GET', `/api/resource/DocType/${docType}`, {});
                const docFields = data.fields.map(({ label, fieldname }) => {
                    return { name: label, value: fieldname };
                });
                docFields.unshift({ name: '*', value: '*' });
                return (0, utils_1.processNames)(docFields);
            },
            async getDocFields() {
                const docType = this.getCurrentNodeParameter('docType');
                const { data } = await GenericFunctions_1.erpNextApiRequest.call(this, 'GET', `/api/resource/DocType/${docType}`, {});
                const docFields = data.fields.map(({ label, fieldname }) => {
                    return { name: label, value: fieldname };
                });
                return (0, utils_1.processNames)(docFields);
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        let responseData;
        const body = {};
        const qs = {};
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/Resources/post_api_resource_Webhook
            // https://frappeframework.com/docs/user/en/guides/integration/rest_api/manipulating_documents
            if (resource === 'document') {
                // *********************************************************************
                //                             document
                // *********************************************************************
                if (operation === 'get') {
                    // ----------------------------------
                    //          document: get
                    // ----------------------------------
                    // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/get_api_resource__DocType___DocumentName_
                    const docType = this.getNodeParameter('docType', i);
                    const documentName = this.getNodeParameter('documentName', i);
                    responseData = await GenericFunctions_1.erpNextApiRequest.call(this, 'GET', `/api/resource/${docType}/${documentName}`);
                    responseData = responseData.data;
                }
                if (operation === 'getAll') {
                    // ----------------------------------
                    //         document: getAll
                    // ----------------------------------
                    // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/get_api_resource__DocType_
                    const docType = this.getNodeParameter('docType', i);
                    const endpoint = `/api/resource/${docType}`;
                    const { fields, filters } = this.getNodeParameter('options', i);
                    // fields=["test", "example", "hi"]
                    if (fields) {
                        if (fields.includes('*')) {
                            qs.fields = JSON.stringify(['*']);
                        }
                        else {
                            qs.fields = JSON.stringify(fields);
                        }
                    }
                    // filters=[["Person","first_name","=","Jane"]]
                    // TODO: filters not working
                    if (filters) {
                        qs.filters = JSON.stringify(filters.customProperty.map((filter) => {
                            return [docType, filter.field, (0, utils_1.toSQL)(filter.operator), filter.value];
                        }));
                    }
                    const returnAll = this.getNodeParameter('returnAll', i);
                    if (!returnAll) {
                        const limit = this.getNodeParameter('limit', i);
                        qs.limit_page_length = limit;
                        qs.limit_start = 0;
                        responseData = await GenericFunctions_1.erpNextApiRequest.call(this, 'GET', endpoint, {}, qs);
                        responseData = responseData.data;
                    }
                    else {
                        responseData = await GenericFunctions_1.erpNextApiRequestAllItems.call(this, 'data', 'GET', endpoint, {}, qs);
                    }
                }
                else if (operation === 'create') {
                    // ----------------------------------
                    //         document: create
                    // ----------------------------------
                    // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/post_api_resource__DocType_
                    const properties = this.getNodeParameter('properties', i);
                    if (!properties.customProperty.length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one property for the document to create.', { itemIndex: i });
                    }
                    properties.customProperty.forEach((property) => {
                        body[property.field] = property.value;
                    });
                    const docType = this.getNodeParameter('docType', i);
                    responseData = await GenericFunctions_1.erpNextApiRequest.call(this, 'POST', `/api/resource/${docType}`, body);
                    responseData = responseData.data;
                }
                else if (operation === 'delete') {
                    // ----------------------------------
                    //         document: delete
                    // ----------------------------------
                    // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/delete_api_resource__DocType___DocumentName_
                    const docType = this.getNodeParameter('docType', i);
                    const documentName = this.getNodeParameter('documentName', i);
                    responseData = await GenericFunctions_1.erpNextApiRequest.call(this, 'DELETE', `/api/resource/${docType}/${documentName}`);
                }
                else if (operation === 'update') {
                    // ----------------------------------
                    //         document: update
                    // ----------------------------------
                    // https://app.swaggerhub.com/apis-docs/alyf.de/ERPNext/11#/General/put_api_resource__DocType___DocumentName_
                    const properties = this.getNodeParameter('properties', i);
                    if (!properties.customProperty.length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one property for the document to update.', { itemIndex: i });
                    }
                    properties.customProperty.forEach((property) => {
                        body[property.field] = property.value;
                    });
                    const docType = this.getNodeParameter('docType', i);
                    const documentName = this.getNodeParameter('documentName', i);
                    responseData = await GenericFunctions_1.erpNextApiRequest.call(this, 'PUT', `/api/resource/${docType}/${documentName}`, body);
                    responseData = responseData.data;
                }
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.ERPNext = ERPNext;
//# sourceMappingURL=ERPNext.node.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const GenericFunctions_1 = require("../../../GenericFunctions");
const properties = [
    {
        displayName: 'Site Name or ID',
        name: 'siteId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getSites',
        },
        default: '',
        description: 'ID of the site containing the collection whose items to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Collection Name or ID',
        name: 'collectionId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getCollections',
            loadOptionsDependsOn: ['siteId'],
        },
        default: '',
        description: 'ID of the collection whose items to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        displayOptions: {
            show: {
                returnAll: [false],
            },
        },
        default: 100,
        description: 'Max number of results to return',
    },
];
const displayOptions = {
    show: {
        resource: ['item'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(items) {
    const returnData = [];
    let responseData;
    for (let i = 0; i < items.length; i++) {
        try {
            const returnAll = this.getNodeParameter('returnAll', i);
            const collectionId = this.getNodeParameter('collectionId', i);
            const qs = {};
            if (returnAll) {
                responseData = await GenericFunctions_1.webflowApiRequestAllItems.call(this, 'GET', `/collections/${collectionId}/items`, {});
            }
            else {
                qs.limit = this.getNodeParameter('limit', i);
                responseData = await GenericFunctions_1.webflowApiRequest.call(this, 'GET', `/collections/${collectionId}/items`, {}, qs);
                responseData = responseData.body.items;
            }
            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        catch (error) {
            if (this.continueOnFail()) {
                returnData.push({ json: { message: error.message, error } });
                continue;
            }
            throw error;
        }
    }
    return returnData;
}
//# sourceMappingURL=getAll.operation.js.map
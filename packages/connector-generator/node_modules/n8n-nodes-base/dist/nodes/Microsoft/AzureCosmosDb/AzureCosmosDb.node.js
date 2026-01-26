"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureCosmosDb = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const methods_1 = require("./methods");
class AzureCosmosDb {
    description = {
        displayName: 'Azure Cosmos DB',
        name: 'azureCosmosDb',
        icon: {
            light: 'file:AzureCosmosDb.svg',
            dark: 'file:AzureCosmosDb.svg',
        },
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with Azure Cosmos DB API',
        defaults: {
            name: 'Azure Cosmos DB',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'microsoftAzureCosmosDbSharedKeyApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '=https://{{ $credentials.account }}.documents.azure.com/dbs/{{ $credentials.database }}',
            json: true,
            ignoreHttpStatusErrors: true,
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Container',
                        value: 'container',
                    },
                    {
                        name: 'Item',
                        value: 'item',
                    },
                ],
                default: 'container',
            },
            ...descriptions_1.container.description,
            ...descriptions_1.item.description,
        ],
    };
    methods = {
        listSearch: methods_1.listSearch,
    };
}
exports.AzureCosmosDb = AzureCosmosDb;
//# sourceMappingURL=AzureCosmosDb.node.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStorage = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class AzureStorage {
    description = {
        displayName: 'Azure Storage',
        name: 'azureStorage',
        icon: {
            light: 'file:azureStorage.svg',
            dark: 'file:azureStorage.dark.svg',
        },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Azure Storage API',
        defaults: {
            name: 'Azure Storage',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'azureStorageOAuth2Api',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['oAuth2'],
                    },
                },
            },
            {
                name: 'azureStorageSharedKeyApi',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['sharedKey'],
                    },
                },
            },
        ],
        requestDefaults: {
            baseURL: '={{ $credentials.baseUrl }}',
        },
        properties: [
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    {
                        name: 'OAuth2',
                        value: 'oAuth2',
                    },
                    {
                        name: 'Shared Key',
                        value: 'sharedKey',
                    },
                ],
                default: 'sharedKey',
            },
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Blob',
                        value: 'blob',
                    },
                    {
                        name: 'Container',
                        value: 'container',
                    },
                ],
                default: 'container',
            },
            ...descriptions_1.blobOperations,
            ...descriptions_1.blobFields,
            ...descriptions_1.containerOperations,
            ...descriptions_1.containerFields,
        ],
    };
    methods = {
        loadOptions: {},
        listSearch: {
            getBlobs: GenericFunctions_1.getBlobs,
            getContainers: GenericFunctions_1.getContainers,
        },
    };
}
exports.AzureStorage = AzureStorage;
//# sourceMappingURL=AzureStorage.node.js.map
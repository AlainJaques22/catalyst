"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudStorage = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BucketDescription_1 = require("./BucketDescription");
const ObjectDescription_1 = require("./ObjectDescription");
class GoogleCloudStorage {
    description = {
        displayName: 'Google Cloud Storage',
        name: 'googleCloudStorage',
        icon: 'file:googleCloudStorage.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Use the Google Cloud Storage API',
        defaults: {
            name: 'Google Cloud Storage',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'googleCloudStorageOAuth2Api',
                required: true,
                testedBy: {
                    request: {
                        method: 'GET',
                        url: '/b/',
                    },
                },
            },
        ],
        requestDefaults: {
            returnFullResponse: true,
            baseURL: 'https://storage.googleapis.com/storage/v1',
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Bucket',
                        value: 'bucket',
                    },
                    {
                        name: 'Object',
                        value: 'object',
                    },
                ],
                default: 'bucket',
            },
            // BUCKET
            ...BucketDescription_1.bucketOperations,
            ...BucketDescription_1.bucketFields,
            // OBJECT
            ...ObjectDescription_1.objectOperations,
            ...ObjectDescription_1.objectFields,
        ],
    };
}
exports.GoogleCloudStorage = GoogleCloudStorage;
//# sourceMappingURL=GoogleCloudStorage.node.js.map
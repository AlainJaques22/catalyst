"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_description_1 = require("../common.description");
const properties = [
    {
        ...common_description_1.userPoolResourceLocator,
        description: 'Select the user pool to use',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        type: 'boolean',
        routing: {
            operations: {
                pagination: {
                    type: 'generic',
                    properties: {
                        continue: '={{ !!$response.body?.NextToken }}',
                        request: {
                            body: {
                                NextToken: '={{ $response.body?.NextToken }}',
                            },
                        },
                    },
                },
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        required: true,
        type: 'number',
        typeOptions: {
            minValue: 1,
            maxValue: 60,
        },
        default: 50,
        description: 'Max number of results to return',
        displayOptions: {
            show: {
                returnAll: [false],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'Limit',
            },
        },
    },
    {
        displayName: 'Include Users',
        name: 'includeUsers',
        type: 'boolean',
        default: false,
        description: 'Whether to include a list of users in the group',
    },
];
const displayOptions = {
    show: {
        resource: ['group'],
        operation: ['getAll'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=getAll.operation.js.map
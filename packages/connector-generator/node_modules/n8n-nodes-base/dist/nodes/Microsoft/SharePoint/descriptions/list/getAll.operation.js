"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.siteRLC,
        description: 'Select the site to retrieve lists from',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        routing: {
            send: {
                paginate: '={{ $value }}',
            },
            operations: {
                pagination: {
                    type: 'generic',
                    properties: {
                        continue: '={{ !!$response.body?.["@odata.nextLink"] }}',
                        request: {
                            url: '={{ $response.body?.["@odata.nextLink"] ?? $request.url }}',
                            qs: {
                                $select: '={{ !!$response.body?.["@odata.nextLink"] ? undefined : $request.qs?.$select }}',
                            },
                        },
                    },
                },
            },
        },
        type: 'boolean',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        default: 50,
        description: 'Max number of results to return',
        displayOptions: {
            show: {
                returnAll: [false],
            },
        },
        routing: {
            send: {
                property: '$top',
                type: 'query',
                value: '={{ $value }}',
            },
        },
        type: 'number',
        typeOptions: {
            minValue: 1,
        },
        validateType: 'number',
    },
    {
        displayName: 'Simplify',
        name: 'simplify',
        default: true,
        routing: {
            send: {
                property: '$select',
                type: 'query',
                value: '={{ $value ? "id,name,displayName,description,createdDateTime,lastModifiedDateTime,webUrl" : undefined }}',
            },
        },
        type: 'boolean',
    },
];
const displayOptions = {
    show: {
        resource: ['list'],
        operation: ['getAll'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=getAll.operation.js.map
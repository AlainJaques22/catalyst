"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binFields = exports.binOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
// Operations for the `Bin` resource:
exports.binOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['bin'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create bin',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/bin',
                    },
                    output: {
                        postReceive: [GenericFunctions_1.transformBinResponse],
                    },
                },
                action: 'Create a bin',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a bin',
                routing: {
                    request: {
                        method: 'GET',
                    },
                    output: {
                        postReceive: [GenericFunctions_1.transformBinResponse],
                    },
                    send: {
                        preSend: [
                            // Parse binId before sending to make sure it's in the right format
                            GenericFunctions_1.buildBinAPIURL,
                        ],
                    },
                },
                action: 'Get a bin',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a bin',
                routing: {
                    request: {
                        method: 'DELETE',
                    },
                    send: {
                        preSend: [
                            // Parse binId before sending to make sure it's in the right format
                            GenericFunctions_1.buildBinAPIURL,
                        ],
                    },
                },
                action: 'Delete a bin',
            },
        ],
        default: 'create',
    },
];
// Properties of the `Bin` resource
exports.binFields = [
    {
        displayName: 'Bin ID',
        name: 'binId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['bin'],
                operation: ['get', 'delete'],
            },
        },
        description: 'Unique identifier for each bin',
    },
];
//# sourceMappingURL=BinDescription.js.map
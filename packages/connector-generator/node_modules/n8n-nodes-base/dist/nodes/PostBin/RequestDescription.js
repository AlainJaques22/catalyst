"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestFields = exports.requestOperations = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
// Operations for the `Request` resource
exports.requestOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['request'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a request',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/api/bin/{{$parameter["binId"]}}/req/{{$parameter["requestId"]}}',
                    },
                    send: {
                        preSend: [
                            // Parse binId before sending to make sure it's in the right format
                            GenericFunctions_1.buildRequestURL,
                        ],
                    },
                },
                action: 'Get a request',
            },
            {
                name: 'Remove First',
                value: 'removeFirst',
                description: 'Remove the first request from bin',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/api/bin/{{$parameter["binId"]}}/req/shift',
                    },
                    send: {
                        preSend: [
                            // Parse binId before sending to make sure it's in the right format
                            GenericFunctions_1.buildRequestURL,
                        ],
                    },
                },
                action: 'Remove First a request',
            },
            {
                name: 'Send',
                value: 'send',
                description: 'Send a test request to the bin',
                routing: {
                    request: {
                        method: 'POST',
                    },
                    send: {
                        preSend: [
                            // Parse binId before sending to make sure it's in the right format
                            GenericFunctions_1.buildBinTestURL,
                        ],
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'set',
                                properties: {
                                    value: '={{ { "requestId": $response.body } }}',
                                },
                            },
                        ],
                    },
                },
                action: 'Send a request',
            },
        ],
        default: 'get',
    },
];
// Properties of the `Request` resource
exports.requestFields = [
    {
        displayName: 'Bin ID',
        name: 'binId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['request'],
                operation: ['get', 'removeFirst', 'send'],
            },
        },
        description: 'Unique identifier for each bin',
    },
    {
        displayName: 'Bin Content',
        name: 'binContent',
        type: 'string',
        default: '',
        typeOptions: {
            rows: 5,
        },
        displayOptions: {
            show: {
                resource: ['request'],
                operation: ['send'],
            },
        },
        // Content is sent in the body of POST requests
        routing: {
            send: {
                property: 'content',
                type: 'body',
            },
        },
    },
    {
        displayName: 'Request ID',
        name: 'requestId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['request'],
                operation: ['get'],
            },
        },
        description: 'Unique identifier for each request',
    },
];
//# sourceMappingURL=RequestDescription.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const create = __importStar(require("./create.operation"));
const del = __importStar(require("./delete.operation"));
const get = __importStar(require("./get.operation"));
const getAll = __importStar(require("./getAll.operation"));
const query = __importStar(require("./query.operation"));
const update = __importStar(require("./update.operation"));
const constants_1 = require("../../helpers/constants");
const errorHandler_1 = require("../../helpers/errorHandler");
const utils_1 = require("../../helpers/utils");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['item'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new item',
                routing: {
                    send: {
                        preSend: [utils_1.validatePartitionKey],
                    },
                    request: {
                        method: 'POST',
                        url: '=/colls/{{ $parameter["container"] }}/docs',
                        headers: {
                            [constants_1.HeaderConstants.X_MS_DOCUMENTDB_IS_UPSERT]: 'True',
                        },
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError],
                    },
                },
                action: 'Create item',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an existing item',
                routing: {
                    send: {
                        preSend: [utils_1.validatePartitionKey],
                    },
                    request: {
                        method: 'DELETE',
                        url: '=/colls/{{ $parameter["container"] }}/docs/{{ $parameter["item"] }}',
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'set',
                                properties: {
                                    value: '={{ { "deleted": true } }}',
                                },
                            },
                        ],
                    },
                },
                action: 'Delete item',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve an item',
                routing: {
                    send: {
                        preSend: [utils_1.validatePartitionKey],
                    },
                    request: {
                        method: 'GET',
                        url: '=/colls/{{ $parameter["container"]}}/docs/{{$parameter["item"]}}',
                        headers: {
                            [constants_1.HeaderConstants.X_MS_DOCUMENTDB_IS_UPSERT]: 'True',
                        },
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError, utils_1.simplifyData],
                    },
                },
                action: 'Get item',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve a list of items',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/colls/{{ $parameter["container"] }}/docs',
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'Documents',
                                },
                            },
                            utils_1.simplifyData,
                        ],
                    },
                },
                action: 'Get many items',
            },
            {
                name: 'Execute Query',
                value: 'query',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/colls/{{ $parameter["container"] }}/docs',
                        headers: {
                            'Content-Type': 'application/query+json',
                            'x-ms-documentdb-isquery': 'True',
                            'x-ms-documentdb-query-enablecrosspartition': 'True',
                        },
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'Documents',
                                },
                            },
                            utils_1.simplifyData,
                        ],
                    },
                },
                action: 'Query items',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing item',
                routing: {
                    send: {
                        preSend: [utils_1.validatePartitionKey],
                    },
                    request: {
                        method: 'PUT',
                        url: '=/colls/{{ $parameter["container"] }}/docs/{{ $parameter["item"] }}',
                        headers: {
                            'Content-Type': 'application/json-patch+json',
                        },
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError],
                    },
                },
                action: 'Update item',
            },
        ],
        default: 'getAll',
    },
    ...create.description,
    ...del.description,
    ...get.description,
    ...getAll.description,
    ...query.description,
    ...update.description,
];
//# sourceMappingURL=Item.resource.js.map
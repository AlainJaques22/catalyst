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
const update = __importStar(require("./update.operation"));
const upsert = __importStar(require("./upsert.operation"));
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
                description: 'Create an item in an existing list',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/sites/{{ $parameter["site"] }}/lists/{{ $parameter["list"] }}/items',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive],
                    },
                },
                action: 'Create item in a list',
            },
            {
                name: 'Create or Update',
                value: 'upsert',
                description: 'Create a new item, or update the current one if it already exists (upsert)',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/sites/{{ $parameter["site"] }}/lists/{{ $parameter["list"] }}/items',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive],
                    },
                },
                action: 'Create or update item (upsert)',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an item from a list',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/sites/{{ $parameter["site"] }}/lists/{{ $parameter["list"] }}/items/{{ $parameter["item"] }}',
                    },
                    output: {
                        postReceive: [
                            utils_1.handleErrorPostReceive,
                            {
                                type: 'set',
                                properties: {
                                    value: '={{ { "deleted": true } }}',
                                },
                            },
                        ],
                    },
                },
                action: 'Delete an item',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve an item from a list',
                routing: {
                    request: {
                        ignoreHttpStatusErrors: true,
                        method: 'GET',
                        url: '=/sites/{{ $parameter["site"] }}/lists/{{ $parameter["list"] }}/items/{{ $parameter["item"] }}',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive, utils_1.simplifyItemPostReceive],
                    },
                },
                action: 'Get an item',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get specific items in a list or list many items',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/sites/{{ $parameter["site"] }}/lists/{{ $parameter["list"] }}/items',
                    },
                    output: {
                        postReceive: [
                            utils_1.handleErrorPostReceive,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'value',
                                },
                            },
                            utils_1.simplifyItemPostReceive,
                        ],
                    },
                },
                action: 'Get many items',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an item in an existing list',
                routing: {
                    request: {
                        method: 'PATCH',
                        url: '=/sites/{{ $parameter["site"] }}/lists/{{ $parameter["list"] }}/items',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive],
                    },
                },
                action: 'Update item in a list',
            },
        ],
        default: 'getAll',
    },
    ...create.description,
    ...del.description,
    ...get.description,
    ...getAll.description,
    ...update.description,
    ...upsert.description,
];
//# sourceMappingURL=Item.resource.js.map
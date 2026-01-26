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
const errorHandler_1 = require("../../helpers/errorHandler");
const utils_1 = require("../../helpers/utils");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'getAll',
        displayOptions: {
            show: {
                resource: ['group'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new group',
                routing: {
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.CreateGroup',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'Group',
                                },
                            },
                        ],
                    },
                },
                action: 'Create group',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an existing group',
                routing: {
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.DeleteGroup',
                        },
                        ignoreHttpStatusErrors: true,
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
                action: 'Delete group',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve details of an existing group',
                routing: {
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetGroup',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError, utils_1.processGroup],
                    },
                },
                action: 'Get group',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve a list of groups',
                routing: {
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.ListGroups',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            utils_1.processGroup,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'Groups',
                                },
                            },
                        ],
                    },
                },
                action: 'Get many groups',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing group',
                routing: {
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.UpdateGroup',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'set',
                                properties: {
                                    value: '={{ { "updated": true } }}',
                                },
                            },
                        ],
                    },
                },
                action: 'Update group',
            },
        ],
    },
    ...create.description,
    ...del.description,
    ...get.description,
    ...getAll.description,
    ...update.description,
];
//# sourceMappingURL=Group.resource.js.map
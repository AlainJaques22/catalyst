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
const addToGroup = __importStar(require("./addToGroup.operation"));
const create = __importStar(require("./create.operation"));
const del = __importStar(require("./delete.operation"));
const get = __importStar(require("./get.operation"));
const getAll = __importStar(require("./getAll.operation"));
const removeFromGroup = __importStar(require("./removeFromGroup.operation"));
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
                resource: ['user'],
            },
        },
        options: [
            {
                name: 'Add to Group',
                value: 'addToGroup',
                description: 'Add an existing user to a group',
                action: 'Add user to group',
                routing: {
                    send: {
                        preSend: [utils_1.preSendUserFields],
                    },
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.AdminAddUserToGroup',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'set',
                                properties: {
                                    value: '={{ { "addedToGroup": true } }}',
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new user',
                action: 'Create user',
                routing: {
                    send: {
                        preSend: [utils_1.preSendUserFields],
                    },
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.AdminCreateUser',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'User',
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a user',
                action: 'Delete user',
                routing: {
                    send: {
                        preSend: [utils_1.preSendUserFields],
                    },
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.AdminDeleteUser',
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
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve information of an existing user',
                action: 'Get user',
                routing: {
                    send: {
                        preSend: [utils_1.preSendUserFields],
                    },
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.AdminGetUser',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError, utils_1.simplifyUser],
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve a list of users',
                routing: {
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.ListUsers',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            utils_1.simplifyUser,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'Users',
                                },
                            },
                        ],
                    },
                },
                action: 'Get many users',
            },
            {
                name: 'Remove From Group',
                value: 'removeFromGroup',
                description: 'Remove a user from a group',
                action: 'Remove user from group',
                routing: {
                    send: {
                        preSend: [utils_1.preSendUserFields],
                    },
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.AdminRemoveUserFromGroup',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            errorHandler_1.handleError,
                            {
                                type: 'set',
                                properties: {
                                    value: '={{ { "removedFromGroup": true } }}',
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing user',
                action: 'Update user',
                routing: {
                    send: {
                        preSend: [utils_1.preSendUserFields],
                    },
                    request: {
                        method: 'POST',
                        headers: {
                            'X-Amz-Target': 'AWSCognitoIdentityProviderService.AdminUpdateUserAttributes',
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
            },
        ],
    },
    ...create.description,
    ...del.description,
    ...get.description,
    ...getAll.description,
    ...update.description,
    ...addToGroup.description,
    ...removeFromGroup.description,
];
//# sourceMappingURL=User.resource.js.map
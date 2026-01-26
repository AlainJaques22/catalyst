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
const constants_1 = require("../../helpers/constants");
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
                    request: {
                        method: 'POST',
                        url: '',
                        body: {
                            Action: 'AddUserToGroup',
                            Version: constants_1.CURRENT_VERSION,
                            UserName: '={{ $parameter["user"] }}',
                            GroupName: '={{ $parameter["group"] }}',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError],
                    },
                },
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new user',
                action: 'Create user',
                routing: {
                    request: {
                        method: 'POST',
                        url: '',
                        body: {
                            Action: 'CreateUser',
                            Version: constants_1.CURRENT_VERSION,
                            UserName: '={{ $parameter["userName"] }}',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError],
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
                        preSend: [utils_1.removeUserFromGroups],
                    },
                    request: {
                        method: 'POST',
                        url: '',
                        body: {
                            Action: 'DeleteUser',
                            Version: constants_1.CURRENT_VERSION,
                            UserName: '={{ $parameter["user"] }}',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError],
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve a user',
                action: 'Get user',
                routing: {
                    request: {
                        method: 'POST',
                        url: '',
                        body: {
                            Action: 'GetUser',
                            Version: constants_1.CURRENT_VERSION,
                            UserName: '={{ $parameter["user"] }}',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'GetUserResponse.GetUserResult.User',
                                },
                            },
                            errorHandler_1.handleError,
                        ],
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
                        url: '',
                        body: {
                            Action: 'ListUsers',
                            Version: constants_1.CURRENT_VERSION,
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError, utils_1.simplifyGetAllUsersResponse],
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
                    request: {
                        method: 'POST',
                        url: '',
                        body: {
                            Action: 'RemoveUserFromGroup',
                            Version: constants_1.CURRENT_VERSION,
                            UserName: '={{ $parameter["user"] }}',
                            GroupName: '={{ $parameter["group"] }}',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError],
                    },
                },
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a user',
                action: 'Update user',
                routing: {
                    request: {
                        method: 'POST',
                        url: '',
                        body: {
                            Action: 'UpdateUser',
                            Version: constants_1.CURRENT_VERSION,
                            NewUserName: '={{ $parameter["userName"] }}',
                            UserName: '={{ $parameter["user"] }}',
                        },
                        ignoreHttpStatusErrors: true,
                    },
                    output: {
                        postReceive: [errorHandler_1.handleError],
                    },
                },
            },
        ],
    },
    ...addToGroup.description,
    ...create.description,
    ...del.description,
    ...get.description,
    ...getAll.description,
    ...update.description,
    ...removeFromGroup.description,
];
//# sourceMappingURL=User.resource.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNameParameter = exports.groupNameParameter = exports.pathParameter = exports.groupLocator = exports.userLocator = exports.paginationParameters = void 0;
const utils_1 = require("../helpers/utils");
exports.paginationParameters = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        default: 100,
        type: 'number',
        validateType: 'number',
        typeOptions: {
            minValue: 1,
        },
        description: 'Max number of results to return',
        displayOptions: {
            hide: {
                returnAll: [true],
            },
        },
        routing: {
            send: {
                property: 'MaxItems',
                type: 'body',
                value: '={{ $value }}',
            },
        },
    },
];
exports.userLocator = {
    displayName: 'User',
    name: 'user',
    required: true,
    type: 'resourceLocator',
    default: {
        mode: 'list',
        value: '',
    },
    modes: [
        {
            displayName: 'From list',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'searchUsers',
                searchable: true,
            },
        },
        {
            displayName: 'By Name',
            name: 'userName',
            type: 'string',
            placeholder: 'e.g. Admins',
            hint: 'Enter the user name',
            validation: [
                {
                    type: 'regex',
                    properties: {
                        regex: '^[\\w+=,.@-]+$',
                        errorMessage: 'The user name must follow the allowed pattern',
                    },
                },
            ],
        },
    ],
};
exports.groupLocator = {
    displayName: 'Group',
    name: 'group',
    required: true,
    type: 'resourceLocator',
    default: {
        mode: 'list',
        value: '',
    },
    modes: [
        {
            displayName: 'From list',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'searchGroups',
                searchable: true,
            },
        },
        {
            displayName: 'By Name',
            name: 'groupName',
            type: 'string',
            placeholder: 'e.g. Admins',
            hint: 'Enter the group name',
            validation: [
                {
                    type: 'regex',
                    properties: {
                        regex: '^[\\w+=,.@-]+$',
                        errorMessage: 'The group name must follow the allowed pattern.',
                    },
                },
            ],
        },
    ],
};
exports.pathParameter = {
    displayName: 'Path',
    name: 'path',
    type: 'string',
    validateType: 'string',
    default: '/',
};
exports.groupNameParameter = {
    displayName: 'Group Name',
    name: 'groupName',
    required: true,
    type: 'string',
    validateType: 'string',
    typeOptions: {
        maxLength: 128,
        regex: '^[+=,.@\\-_A-Za-z0-9]+$',
    },
    default: '',
    placeholder: 'e.g. GroupName',
    routing: {
        send: {
            preSend: [utils_1.validateName],
        },
    },
};
exports.userNameParameter = {
    displayName: 'User Name',
    name: 'userName',
    required: true,
    type: 'string',
    validateType: 'string',
    default: '',
    placeholder: 'e.g. JohnSmith',
    typeOptions: {
        maxLength: 64,
        regex: '^[A-Za-z0-9+=,\\.@_-]+$',
    },
    routing: {
        send: {
            preSend: [utils_1.validateName],
        },
    },
};
//# sourceMappingURL=common.js.map
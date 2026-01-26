"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationParameters = exports.itemResourceLocator = exports.containerResourceLocator = void 0;
const constants_1 = require("../helpers/constants");
const utils_1 = require("../helpers/utils");
exports.containerResourceLocator = {
    displayName: 'Container',
    name: 'container',
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
                searchListMethod: 'searchContainers',
                searchable: true,
            },
        },
        {
            displayName: 'By ID',
            name: 'id',
            hint: 'Enter the container ID',
            placeholder: 'e.g. AndersenFamily',
            type: 'string',
            validation: [
                {
                    type: 'regex',
                    properties: {
                        regex: '^[\\w+=,.@-]+$',
                        errorMessage: 'The container ID must follow the allowed pattern',
                    },
                },
            ],
        },
    ],
    required: true,
    type: 'resourceLocator',
};
exports.itemResourceLocator = {
    displayName: 'Item',
    name: 'item',
    default: {
        mode: 'list',
        value: '',
    },
    displayOptions: {
        hide: {
            ...utils_1.untilContainerSelected,
        },
    },
    modes: [
        {
            displayName: 'From list',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'searchItems',
                searchable: true,
            },
        },
        {
            displayName: 'By ID',
            name: 'id',
            hint: 'Enter the item ID',
            placeholder: 'e.g. AndersenFamily',
            type: 'string',
            validation: [
                {
                    type: 'regex',
                    properties: {
                        regex: '^[\\w+=,.@-]+$',
                        errorMessage: 'The item ID must follow the allowed pattern',
                    },
                },
            ],
        },
    ],
    required: true,
    type: 'resourceLocator',
};
exports.paginationParameters = [
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
                        continue: `={{ !!$response.headers?.["${constants_1.HeaderConstants.X_MS_CONTINUATION}"] }}`,
                        request: {
                            headers: {
                                [constants_1.HeaderConstants.X_MS_CONTINUATION]: `={{ $response.headers?.["${constants_1.HeaderConstants.X_MS_CONTINUATION}"] }}`,
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
            request: {
                headers: {
                    [constants_1.HeaderConstants.X_MS_MAX_ITEM_COUNT]: '={{ $value || undefined }}',
                },
            },
        },
        type: 'number',
        typeOptions: {
            minValue: 1,
        },
        validateType: 'number',
    },
];
//# sourceMappingURL=common.js.map
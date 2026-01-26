"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConfigFields = exports.ALLOWED_CONFIG_KEYS = void 0;
exports.ALLOWED_CONFIG_KEYS = ['user.email', 'user.name', 'remote.origin.url'];
exports.addConfigFields = [
    {
        displayName: 'Key',
        name: 'key',
        type: 'options',
        displayOptions: {
            show: {
                operation: ['addConfig'],
                '@version': [{ _cnd: { gte: 1.1 } }],
            },
        },
        options: exports.ALLOWED_CONFIG_KEYS.map((key) => ({
            name: key,
            value: key,
        })),
        default: '',
        description: 'Name of the key to set',
        required: true,
    },
    {
        displayName: 'Key',
        name: 'key',
        type: 'string',
        displayOptions: {
            show: {
                operation: ['addConfig'],
                '@version': [{ _cnd: { lt: 1.1 } }],
            },
        },
        default: '',
        placeholder: 'user.email',
        description: 'Name of the key to set',
        required: true,
    },
    {
        displayName: 'Value',
        name: 'value',
        type: 'string',
        displayOptions: {
            show: {
                operation: ['addConfig'],
            },
        },
        default: '',
        placeholder: 'name@example.com',
        description: 'Value of the key to set',
        required: true,
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        displayOptions: {
            show: {
                operation: ['addConfig'],
            },
        },
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Mode',
                name: 'mode',
                type: 'options',
                options: [
                    {
                        name: 'Append',
                        value: 'append',
                    },
                    {
                        name: 'Set',
                        value: 'set',
                    },
                ],
                default: 'set',
                description: 'Append setting rather than set it in the local config',
            },
        ],
    },
];
//# sourceMappingURL=AddConfigDescription.js.map
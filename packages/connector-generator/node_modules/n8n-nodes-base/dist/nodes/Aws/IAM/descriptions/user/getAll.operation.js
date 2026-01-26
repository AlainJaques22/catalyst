"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_1 = require("../common");
const properties = [
    ...common_1.paginationParameters,
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        options: [
            {
                displayName: 'Path Prefix',
                name: 'pathPrefix',
                type: 'string',
                validateType: 'string',
                default: '/',
                description: 'The path prefix for filtering the results',
                placeholder: 'e.g. /division_abc/subdivision_xyz/',
                routing: {
                    send: {
                        preSend: [utils_1.validateUserPath],
                        property: 'PathPrefix',
                        value: '={{ $value }}',
                    },
                },
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['getAll'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=getAll.operation.js.map
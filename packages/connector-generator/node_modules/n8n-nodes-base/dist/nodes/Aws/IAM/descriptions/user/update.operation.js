"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_1 = require("../common");
const properties = [
    {
        ...common_1.userLocator,
        description: 'Select the user you want to update',
    },
    {
        ...common_1.userNameParameter,
        description: 'The new name of the user',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
            {
                ...common_1.pathParameter,
                placeholder: 'e.g. /division_abc/subdivision_xyz/',
                routing: {
                    send: {
                        preSend: [utils_1.validatePath],
                        property: 'NewPath',
                        type: 'query',
                    },
                },
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['update'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=update.operation.js.map
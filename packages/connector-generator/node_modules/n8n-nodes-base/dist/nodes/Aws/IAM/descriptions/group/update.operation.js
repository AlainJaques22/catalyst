"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_1 = require("../common");
const properties = [
    {
        ...common_1.groupLocator,
        description: 'Select the group you want to update',
    },
    {
        ...common_1.groupNameParameter,
        description: 'The new name of the group',
        placeholder: 'e.g. GroupName',
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
                placeholder: 'e.g. /division_abc/engineering/',
                description: 'The new path to the group, if it is not included, it defaults to a slash (/)',
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
        resource: ['group'],
        operation: ['update'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=update.operation.js.map
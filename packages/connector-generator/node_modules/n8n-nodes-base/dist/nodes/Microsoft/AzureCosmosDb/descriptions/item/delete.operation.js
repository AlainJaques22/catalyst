"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_1 = require("../common");
const properties = [
    { ...common_1.containerResourceLocator, description: 'Select the container you want to use' },
    { ...common_1.itemResourceLocator, description: 'Select the item to be deleted' },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        default: {},
        displayOptions: {
            hide: {
                ...utils_1.untilContainerSelected,
                ...utils_1.untilItemSelected,
            },
        },
        options: [
            {
                displayName: 'Partition Key',
                name: 'partitionKey',
                default: '',
                hint: 'Only required if a custom partition key is set for the container',
                type: 'string',
            },
        ],
        placeholder: 'Add Partition Key',
        type: 'collection',
    },
];
const displayOptions = {
    show: {
        resource: ['item'],
        operation: ['delete'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=delete.operation.js.map
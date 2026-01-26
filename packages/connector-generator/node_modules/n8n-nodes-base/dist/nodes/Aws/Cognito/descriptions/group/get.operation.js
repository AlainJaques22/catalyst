"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_description_1 = require("../common.description");
const properties = [
    {
        ...common_description_1.userPoolResourceLocator,
        description: 'Select the user pool to use',
    },
    {
        ...common_description_1.groupResourceLocator,
        description: 'Select the group you want to retrieve',
    },
    {
        displayName: 'Include Users',
        name: 'includeUsers',
        type: 'boolean',
        default: false,
        description: 'Whether to include a list of users in the group',
    },
];
const displayOptions = {
    show: {
        resource: ['group'],
        operation: ['get'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=get.operation.js.map
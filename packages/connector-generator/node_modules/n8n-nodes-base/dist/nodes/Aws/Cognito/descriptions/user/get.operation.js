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
        ...common_description_1.userResourceLocator,
        description: 'Select the user you want to retrieve',
    },
    {
        displayName: 'Simplify',
        name: 'simple',
        type: 'boolean',
        default: true,
        description: 'Whether to return a simplified version of the response instead of the raw data',
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['get'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=get.operation.js.map
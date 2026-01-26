"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_1 = require("../common");
const properties = [
    { ...common_1.containerResourceLocator, description: 'Select the container you want to retrieve' },
    {
        displayName: 'Simplify',
        name: 'simple',
        default: true,
        description: 'Whether to return a simplified version of the response instead of the raw data',
        type: 'boolean',
    },
];
const displayOptions = {
    show: {
        resource: ['container'],
        operation: ['get'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=get.operation.js.map
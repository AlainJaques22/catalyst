"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_1 = require("../common");
const properties = [
    ...common_1.paginationParameters,
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
        operation: ['getAll'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=getAll.operation.js.map
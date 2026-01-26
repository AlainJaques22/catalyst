"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_1 = require("../common");
const properties = [
    {
        ...common_1.groupLocator,
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
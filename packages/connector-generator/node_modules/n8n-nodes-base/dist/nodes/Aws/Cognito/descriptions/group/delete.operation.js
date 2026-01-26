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
        description: 'Select the group you want to delete',
    },
];
const displayOptions = {
    show: {
        resource: ['group'],
        operation: ['delete'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=delete.operation.js.map
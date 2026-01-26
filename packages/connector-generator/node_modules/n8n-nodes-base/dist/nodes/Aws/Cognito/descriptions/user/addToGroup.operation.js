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
        description: 'Select the user you want to add to the group',
    },
    {
        ...common_description_1.groupResourceLocator,
        description: 'Select the group you want to add the user to',
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['addToGroup'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=addToGroup.operation.js.map
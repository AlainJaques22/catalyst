"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_1 = require("../common");
const properties = [
    {
        ...common_1.userLocator,
        description: 'Select the user you want to add to the group',
    },
    {
        ...common_1.groupLocator,
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
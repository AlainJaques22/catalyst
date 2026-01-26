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
        description: 'Select the user you want to remove from the group',
    },
    {
        ...common_description_1.groupResourceLocator,
        description: 'Select the group you want to remove the user from',
        modes: common_description_1.groupResourceLocator.modes?.map((mode) => mode.name === 'list'
            ? {
                ...mode,
                typeOptions: {
                    ...mode.typeOptions,
                    searchListMethod: 'searchGroupsForUser',
                },
            }
            : mode),
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['removeFromGroup'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=removeFromGroup.operation.js.map
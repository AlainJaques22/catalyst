"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_1 = require("../common");
const properties = [
    {
        ...common_1.userLocator,
        description: 'Select the user you want to remove from the group',
    },
    {
        ...common_1.groupLocator,
        description: 'Select the group you want to remove the user from',
        modes: [
            {
                displayName: 'From list',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'searchGroupsForUser',
                    searchable: true,
                },
            },
            {
                displayName: 'By Name',
                name: 'groupName',
                type: 'string',
                hint: 'Enter the group name',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[\\w+=,.@-]+$',
                            errorMessage: 'The group name must follow the allowed pattern',
                        },
                    },
                ],
                placeholder: 'e.g. Admins',
            },
        ],
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
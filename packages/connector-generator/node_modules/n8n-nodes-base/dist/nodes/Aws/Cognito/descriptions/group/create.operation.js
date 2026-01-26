"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_description_1 = require("../common.description");
const properties = [
    {
        ...common_description_1.userPoolResourceLocator,
        description: 'Select the user pool to use',
    },
    {
        displayName: 'Group Name',
        name: 'newGroupName',
        default: '',
        placeholder: 'e.g. MyNewGroup',
        description: 'The name of the new group to create',
        required: true,
        type: 'string',
        validateType: 'string',
        routing: {
            send: {
                property: 'GroupName',
                type: 'body',
                preSend: [
                    async function (requestOptions) {
                        const newGroupName = this.getNodeParameter('newGroupName', '');
                        const groupNameRegex = /^[\p{L}\p{M}\p{S}\p{N}\p{P}]+$/u;
                        if (!groupNameRegex.test(newGroupName)) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                                message: 'Invalid format for Group Name',
                                description: 'Group Name should not contain spaces.',
                            });
                        }
                        return requestOptions;
                    },
                ],
            },
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        default: {},
        options: [
            {
                displayName: 'Description',
                name: 'description',
                default: '',
                placeholder: 'e.g. New group description',
                description: 'A description for the new group',
                type: 'string',
                routing: {
                    send: {
                        type: 'body',
                        property: 'Description',
                    },
                },
            },
            {
                displayName: 'Precedence',
                name: 'precedence',
                default: '',
                placeholder: 'e.g. 10',
                description: 'Precedence value for the group. Lower values indicate higher priority.',
                type: 'number',
                routing: {
                    send: {
                        type: 'body',
                        property: 'Precedence',
                    },
                },
                validateType: 'number',
            },
            {
                displayName: 'Role ARN',
                name: 'arn',
                default: '',
                placeholder: 'e.g. arn:aws:iam::123456789012:role/GroupRole',
                description: 'The role ARN for the group, used for setting claims in tokens',
                type: 'string',
                routing: {
                    send: {
                        type: 'body',
                        property: 'Arn',
                        preSend: [utils_1.validateArn],
                    },
                },
            },
        ],
        placeholder: 'Add Option',
        type: 'collection',
    },
];
const displayOptions = {
    show: {
        resource: ['group'],
        operation: ['create'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=create.operation.js.map
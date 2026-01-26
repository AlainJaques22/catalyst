"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_1 = require("../common");
const properties = [
    {
        ...common_1.userNameParameter,
        description: 'The username of the new user to create',
        placeholder: 'e.g. UserName',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
            {
                ...common_1.pathParameter,
                description: 'The path for the user name',
                placeholder: 'e.g. /division_abc/subdivision_xyz/',
                routing: {
                    send: {
                        preSend: [utils_1.validatePath],
                        property: 'Path',
                        type: 'query',
                    },
                },
            },
            {
                displayName: 'Permissions Boundary',
                name: 'permissionsBoundary',
                default: '',
                description: 'The ARN of the managed policy that is used to set the permissions boundary for the user',
                placeholder: 'e.g. arn:aws:iam::123456789012:policy/ExampleBoundaryPolicy',
                type: 'string',
                validateType: 'string',
                routing: {
                    send: {
                        preSend: [utils_1.validatePermissionsBoundary],
                    },
                },
            },
            {
                displayName: 'Tags',
                name: 'tags',
                type: 'fixedCollection',
                description: 'A list of tags that you want to attach to the new user',
                default: [],
                placeholder: 'Add Tag',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'tags',
                        displayName: 'Tag',
                        values: [
                            {
                                displayName: 'Key',
                                name: 'key',
                                type: 'string',
                                default: '',
                                placeholder: 'e.g., Department',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                placeholder: 'e.g., Engineering',
                            },
                        ],
                    },
                ],
                routing: {
                    send: {
                        preSend: [utils_1.preprocessTags],
                    },
                },
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['create'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=create.operation.js.map
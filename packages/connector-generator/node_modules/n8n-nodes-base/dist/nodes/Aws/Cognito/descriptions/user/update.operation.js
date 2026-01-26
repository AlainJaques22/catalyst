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
    common_description_1.userResourceLocator,
    {
        displayName: 'User Attributes',
        name: 'userAttributes',
        type: 'fixedCollection',
        placeholder: 'Add Attribute',
        default: {
            attributes: [],
        },
        required: true,
        description: 'Attributes to update for the user',
        typeOptions: {
            multipleValues: true,
        },
        routing: {
            send: {
                preSend: [utils_1.preSendAttributes],
            },
        },
        options: [
            {
                displayName: 'Attributes',
                name: 'attributes',
                values: [
                    {
                        displayName: 'Attribute Type',
                        name: 'attributeType',
                        type: 'options',
                        default: 'standard',
                        options: [
                            {
                                name: 'Standard Attribute',
                                value: 'standard',
                            },
                            {
                                name: 'Custom Attribute',
                                value: 'custom',
                            },
                        ],
                    },
                    {
                        displayName: 'Standard Attribute',
                        name: 'standardName',
                        type: 'options',
                        default: 'address',
                        options: [
                            {
                                name: 'Address',
                                value: 'address',
                            },
                            {
                                name: 'Birthdate',
                                value: 'birthdate',
                            },
                            {
                                name: 'Email',
                                value: 'email',
                            },
                            {
                                name: 'Family Name',
                                value: 'family_name',
                            },
                            {
                                name: 'Gender',
                                value: 'gender',
                            },
                            {
                                name: 'Given Name',
                                value: 'given_name',
                            },
                            {
                                name: 'Locale',
                                value: 'locale',
                            },
                            {
                                name: 'Middle Name',
                                value: 'middle_name',
                            },
                            {
                                name: 'Name',
                                value: 'name',
                            },
                            {
                                name: 'Nickname',
                                value: 'nickname',
                            },
                            {
                                name: 'Phone Number',
                                value: 'phone_number',
                            },
                            {
                                name: 'Preferred Username',
                                value: 'preferred_username',
                            },
                            {
                                name: 'Profile Picture',
                                value: 'profilepicture',
                            },
                            {
                                name: 'Updated At',
                                value: 'updated_at',
                            },
                            {
                                name: 'User Sub',
                                value: 'sub',
                            },
                            {
                                name: 'Website',
                                value: 'website',
                            },
                            {
                                name: 'Zone Info',
                                value: 'zoneinfo',
                            },
                        ],
                        displayOptions: {
                            show: {
                                attributeType: ['standard'],
                            },
                        },
                    },
                    {
                        displayName: 'Custom Attribute Name',
                        name: 'customName',
                        type: 'string',
                        default: '',
                        placeholder: 'custom:myAttribute',
                        description: 'The name of the custom attribute (must start with "custom:")',
                        displayOptions: {
                            show: {
                                attributeType: ['custom'],
                            },
                        },
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                        description: 'The value of the attribute',
                    },
                ],
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['update'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=update.operation.js.map
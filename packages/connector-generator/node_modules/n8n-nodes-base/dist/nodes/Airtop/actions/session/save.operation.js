"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
const fields_1 = require("../common/fields");
exports.description = [
    {
        displayName: "Note: This operation is not needed if you enabled 'Save Profile' in the 'Create Session' operation",
        name: 'notice',
        type: 'notice',
        displayOptions: {
            show: {
                resource: ['session'],
                operation: ['save'],
            },
        },
        default: 'This operation will save the profile on session termination',
    },
    {
        ...fields_1.sessionIdField,
        displayOptions: {
            show: {
                resource: ['session'],
                operation: ['save'],
            },
        },
    },
    {
        ...fields_1.profileNameField,
        required: true,
        description: 'The name of the <a href="https://docs.airtop.ai/guides/how-to/saving-a-profile" target="_blank">Profile</a> to save',
        displayOptions: {
            show: {
                resource: ['session'],
                operation: ['save'],
            },
        },
        hint: 'Name of the profile you want to save. Must consist only of alphanumeric characters and hyphens "-"',
    },
];
async function execute(index) {
    const sessionId = GenericFunctions_1.validateSessionId.call(this, index);
    let profileName = GenericFunctions_1.validateRequiredStringField.call(this, index, 'profileName', 'Profile Name');
    profileName = GenericFunctions_1.validateProfileName.call(this, index);
    const response = await transport_1.apiRequest.call(this, 'PUT', `/sessions/${sessionId}/save-profile-on-termination/${profileName}`);
    // validate response
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, profileName, ...response });
}
//# sourceMappingURL=save.operation.js.map
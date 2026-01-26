"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const helpers_1 = require("./helpers");
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
const fields_1 = require("../common/fields");
exports.description = [
    {
        ...fields_1.elementDescriptionField,
        required: true,
        placeholder: 'e.g. the rounded user profile image at the top right of the page',
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['hover'],
            },
        },
    },
];
async function execute(index) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    const elementDescription = GenericFunctions_1.validateRequiredStringField.call(this, index, 'elementDescription', 'Element Description');
    const request = helpers_1.constructInteractionRequest.call(this, index, {
        elementDescription,
    });
    const response = await transport_1.apiRequest.call(this, 'POST', `/sessions/${sessionId}/windows/${windowId}/hover`, request);
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, windowId, ...response });
}
//# sourceMappingURL=hover.operation.js.map
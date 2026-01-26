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
        displayName: 'Text',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['type'],
            },
        },
        description: 'The text to type into the browser window',
        placeholder: 'e.g. email@example.com',
    },
    {
        displayName: 'Press Enter Key',
        name: 'pressEnterKey',
        type: 'boolean',
        default: false,
        description: 'Whether to press the Enter key after typing the text',
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['type'],
            },
        },
    },
    {
        ...fields_1.elementDescriptionField,
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['type'],
            },
        },
    },
];
async function execute(index) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    const text = GenericFunctions_1.validateRequiredStringField.call(this, index, 'text', 'Text');
    const pressEnterKey = this.getNodeParameter('pressEnterKey', index);
    const elementDescription = this.getNodeParameter('elementDescription', index);
    const request = helpers_1.constructInteractionRequest.call(this, index, {
        text,
        pressEnterKey,
        elementDescription,
    });
    const response = await transport_1.apiRequest.call(this, 'POST', `/sessions/${sessionId}/windows/${windowId}/type`, request);
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, windowId, ...response });
}
//# sourceMappingURL=type.operation.js.map
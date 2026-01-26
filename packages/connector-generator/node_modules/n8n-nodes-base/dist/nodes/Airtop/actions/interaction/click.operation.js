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
        placeholder: 'e.g. the green "save" button at the top of the page',
        required: true,
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['click'],
            },
        },
    },
    {
        displayName: 'Click Type',
        name: 'clickType',
        type: 'options',
        default: 'click',
        description: 'The type of click to perform. Defaults to left click.',
        options: [
            {
                name: 'Left Click',
                value: 'click',
            },
            {
                name: 'Double Click',
                value: 'doubleClick',
            },
            {
                name: 'Right Click',
                value: 'rightClick',
            },
        ],
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['click'],
            },
        },
    },
];
async function execute(index) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    const elementDescription = GenericFunctions_1.validateRequiredStringField.call(this, index, 'elementDescription', 'Element Description');
    const clickType = GenericFunctions_1.validateRequiredStringField.call(this, index, 'clickType', 'Click Type');
    const request = helpers_1.constructInteractionRequest.call(this, index, {
        elementDescription,
        configuration: {
            clickType,
        },
    });
    const response = await transport_1.apiRequest.call(this, 'POST', `/sessions/${sessionId}/windows/${windowId}/click`, request);
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, windowId, ...response });
}
//# sourceMappingURL=click.operation.js.map
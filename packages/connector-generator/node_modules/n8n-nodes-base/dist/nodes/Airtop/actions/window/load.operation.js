"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
const fields_1 = require("../common/fields");
exports.description = [
    {
        ...fields_1.urlField,
        required: true,
        displayOptions: {
            show: {
                resource: ['window'],
                operation: ['load'],
            },
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['window'],
                operation: ['load'],
            },
        },
        options: [
            {
                displayName: 'Wait Until',
                name: 'waitUntil',
                type: 'options',
                default: 'load',
                description: "Wait until the specified loading event occurs. Defaults to 'Fully Loaded'.",
                options: [
                    {
                        name: 'Complete',
                        value: 'complete',
                        description: "Wait until the page and all it's iframes have loaded it's dom and assets",
                    },
                    {
                        name: 'DOM Only Loaded',
                        value: 'domContentLoaded',
                        description: 'Wait until the dom has loaded',
                    },
                    {
                        name: 'Fully Loaded',
                        value: 'load',
                        description: "Wait until the page dom and it's assets have loaded",
                    },
                    {
                        name: 'No Wait',
                        value: 'noWait',
                        description: 'Do not wait for any loading event and will return immediately',
                    },
                ],
            },
        ],
    },
];
async function execute(index) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    let url = GenericFunctions_1.validateRequiredStringField.call(this, index, 'url', 'URL');
    url = GenericFunctions_1.validateUrl.call(this, index);
    const additionalFields = this.getNodeParameter('additionalFields', index);
    const response = await transport_1.apiRequest.call(this, 'POST', `/sessions/${sessionId}/windows/${windowId}`, {
        url,
        waitUntil: additionalFields.waitUntil,
    });
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, windowId, ...response });
}
//# sourceMappingURL=load.operation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../../constants");
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
exports.description = [
    {
        displayName: 'Form Data',
        name: 'formData',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['fill'],
            },
        },
        description: 'The information to fill into the form written in natural language',
        placeholder: 'e.g. "Name: John Doe, Email: john.doe@example.com"',
    },
];
async function execute(index, timeout = constants_1.OPERATION_TIMEOUT) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    const formData = GenericFunctions_1.validateRequiredStringField.call(this, index, 'formData', 'Form Data');
    // run automation
    const asyncAutomationResponse = await transport_1.apiRequest.call(this, 'POST', `/async/sessions/${sessionId}/windows/${windowId}/execute-automation`, {
        automationId: 'auto',
        parameters: {
            customData: formData,
        },
    });
    const reqId = asyncAutomationResponse.requestId;
    // Poll status every second until it's completed or timeout is reached
    const startTime = Date.now();
    let automationStatusResponse;
    while (true) {
        automationStatusResponse = await transport_1.apiRequest.call(this, 'GET', `/requests/${reqId}/status`);
        const status = automationStatusResponse?.status ?? '';
        (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), automationStatusResponse);
        if (status === 'completed' || status === 'error') {
            break;
        }
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= timeout) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: constants_1.ERROR_MESSAGES.TIMEOUT_REACHED,
                code: 500,
            });
        }
        // Wait one second
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return this.helpers.returnJsonArray({ sessionId, windowId, ...automationStatusResponse });
}
//# sourceMappingURL=fill.operation.js.map
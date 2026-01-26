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
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['window'],
                operation: ['getLiveView'],
            },
        },
        options: [
            {
                displayName: 'Include Navigation Bar',
                name: 'includeNavigationBar',
                type: 'boolean',
                default: false,
                description: 'Whether to include the navigation bar in the Live View. When enabled, the navigation bar will be visible allowing you to navigate between pages.',
            },
            {
                displayName: 'Screen Resolution',
                name: 'screenResolution',
                type: 'string',
                default: '',
                description: 'The screen resolution of the Live View. Setting a resolution will force the window to open at that specific size.',
                placeholder: 'e.g. 1280x720',
            },
            {
                displayName: 'Disable Resize',
                name: 'disableResize',
                type: 'boolean',
                default: false,
                description: 'Whether to disable the window from being resized in the Live View',
            },
        ],
    },
];
async function execute(index) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    const additionalFields = this.getNodeParameter('additionalFields', index);
    const queryParams = {};
    if (additionalFields.includeNavigationBar) {
        queryParams.includeNavigationBar = true;
    }
    if (additionalFields.screenResolution) {
        const screenResolution = (additionalFields.screenResolution || '')
            .trim()
            .toLowerCase();
        const regex = /^\d{3,4}x\d{3,4}$/; // Expected format: 1280x720
        if (!regex.test(screenResolution)) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), constants_1.ERROR_MESSAGES.SCREEN_RESOLUTION_INVALID, {
                itemIndex: index,
            });
        }
        queryParams.screenResolution = screenResolution;
    }
    if (additionalFields.disableResize) {
        queryParams.disableResize = true;
    }
    const response = await transport_1.apiRequest.call(this, 'GET', `/sessions/${sessionId}/windows/${windowId}`, undefined, queryParams);
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, windowId, ...response });
}
//# sourceMappingURL=getLiveView.operation.js.map
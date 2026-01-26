"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class ErrorTrigger {
    description = {
        displayName: 'Error Trigger',
        name: 'errorTrigger',
        icon: 'fa:bug',
        iconColor: 'blue',
        group: ['trigger'],
        version: 1,
        description: 'Triggers the workflow when another workflow has an error',
        eventTriggerDescription: '',
        mockManualExecution: true,
        maxNodes: 1,
        defaults: {
            name: 'Error Trigger',
            color: '#0000FF',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'This node will trigger when there is an error in another workflow, as long as that workflow is set up to do so. <a href="https://docs.n8n.io/integrations/core-nodes/n8n-nodes-base.errortrigger" target="_blank">More info</a>',
                name: 'notice',
                type: 'notice',
                default: '',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const mode = this.getMode();
        if (mode === 'manual' &&
            items.length === 1 &&
            Object.keys(items[0].json).length === 0 &&
            items[0].binary === undefined) {
            // If we are in manual mode and no input data got provided we return
            // example data to allow to develope and test errorWorkflows easily
            const restApiUrl = this.getRestApiUrl();
            const urlParts = restApiUrl.split('/');
            urlParts.pop();
            urlParts.push('execution');
            const id = 231;
            items[0].json = {
                execution: {
                    id,
                    url: `${urlParts.join('/')}/workflow/1/${id}`,
                    retryOf: '34',
                    error: {
                        message: 'Example Error Message',
                        stack: 'Stacktrace',
                    },
                    lastNodeExecuted: 'Node With Error',
                    mode: 'manual',
                },
                workflow: {
                    id: '1',
                    name: 'Example Workflow',
                },
            };
        }
        return [items];
    }
}
exports.ErrorTrigger = ErrorTrigger;
//# sourceMappingURL=ErrorTrigger.node.js.map
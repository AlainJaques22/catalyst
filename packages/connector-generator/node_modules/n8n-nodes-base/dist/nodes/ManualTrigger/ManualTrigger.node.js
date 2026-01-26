"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class ManualTrigger {
    description = {
        displayName: 'Manual Trigger',
        name: 'manualTrigger',
        icon: 'fa:mouse-pointer',
        group: ['trigger'],
        version: 1,
        description: 'Runs the flow on clicking a button in n8n',
        eventTriggerDescription: '',
        maxNodes: 1,
        defaults: {
            name: 'When clicking ‘Execute workflow’',
            color: '#909298',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'This node is where the workflow execution starts (when you click the ‘test’ button on the canvas).<br><br> <a data-action="showNodeCreator">Explore other ways to trigger your workflow</a> (e.g on a schedule, or a webhook)',
                name: 'notice',
                type: 'notice',
                default: '',
            },
        ],
    };
    async trigger() {
        const manualTriggerFunction = async () => {
            this.emit([this.helpers.returnJsonArray([{}])]);
        };
        return {
            manualTriggerFunction,
        };
    }
}
exports.ManualTrigger = ManualTrigger;
//# sourceMappingURL=ManualTrigger.node.js.map
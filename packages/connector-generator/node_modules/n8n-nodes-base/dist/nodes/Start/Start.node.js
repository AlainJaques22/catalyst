"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Start = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Start {
    description = {
        displayName: 'Start',
        name: 'start',
        icon: 'fa:play',
        group: ['input'],
        version: 1,
        description: 'Starts the workflow execution from this node',
        maxNodes: 1,
        hidden: true,
        defaults: {
            name: 'Start',
            color: '#00e000',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'This node is where a manual workflow execution starts. To make one, go back to the canvas and click ‘execute workflow’',
                name: 'notice',
                type: 'notice',
                default: '',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        return [items];
    }
}
exports.Start = Start;
//# sourceMappingURL=Start.node.js.map
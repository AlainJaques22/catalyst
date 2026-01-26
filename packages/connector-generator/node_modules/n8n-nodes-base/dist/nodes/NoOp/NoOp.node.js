"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoOp = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class NoOp {
    description = {
        displayName: 'No Operation, do nothing',
        name: 'noOp',
        icon: 'fa:arrow-right',
        iconColor: 'gray',
        group: ['organization'],
        version: 1,
        description: 'No Operation',
        defaults: {
            name: 'No Operation, do nothing',
            color: '#b0b0b0',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [],
    };
    async execute() {
        const items = this.getInputData();
        return [items];
    }
}
exports.NoOp = NoOp;
//# sourceMappingURL=NoOp.node.js.map
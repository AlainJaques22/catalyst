"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class N8nTrigger {
    description = {
        displayName: 'n8n Trigger',
        name: 'n8nTrigger',
        icon: 'file:n8nTrigger.svg',
        group: ['trigger'],
        version: 1,
        description: 'Handle events and perform actions on your n8n instance',
        eventTriggerDescription: '',
        mockManualExecution: true,
        defaults: {
            name: 'n8n Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Events',
                name: 'events',
                type: 'multiOptions',
                required: true,
                default: [],
                description: `Specifies under which conditions an execution should happen:
				<ul>
					<li><b>Active Workflow Updated</b>: Triggers when this workflow is updated</li>
					<li><b>Instance Started</b>:  Triggers when this n8n instance is started or re-started</li>
					<li><b>Workflow Activated</b>: Triggers when this workflow is activated</li>
				</ul>`,
                options: [
                    {
                        name: 'Active Workflow Updated',
                        value: 'update',
                        description: 'Triggers when this workflow is updated',
                    },
                    {
                        name: 'Instance Started',
                        value: 'init',
                        description: 'Triggers when this n8n instance is started or re-started',
                    },
                    {
                        name: 'Workflow Activated',
                        value: 'activate',
                        description: 'Triggers when this workflow is activated',
                    },
                ],
            },
        ],
    };
    async trigger() {
        const events = this.getNodeParameter('events') || [];
        const activationMode = this.getActivationMode();
        if (events.includes(activationMode)) {
            let event;
            if (activationMode === 'activate') {
                event = 'Workflow activated';
            }
            if (activationMode === 'update') {
                event = 'Workflow updated';
            }
            if (activationMode === 'init') {
                event = 'Instance started';
            }
            this.emit([
                this.helpers.returnJsonArray([
                    { event, timestamp: new Date().toISOString(), workflow_id: this.getWorkflow().id },
                ]),
            ]);
        }
        const manualTriggerFunction = async () => {
            this.emit([
                this.helpers.returnJsonArray([
                    {
                        event: 'Manual execution',
                        timestamp: new Date().toISOString(),
                        workflow_id: this.getWorkflow().id,
                    },
                ]),
            ]);
        };
        return {
            manualTriggerFunction,
        };
    }
}
exports.N8nTrigger = N8nTrigger;
//# sourceMappingURL=N8nTrigger.node.js.map
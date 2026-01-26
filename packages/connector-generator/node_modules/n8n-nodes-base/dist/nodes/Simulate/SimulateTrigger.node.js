"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulateTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const methods_1 = require("./methods");
class SimulateTrigger {
    description = {
        hidden: true,
        displayName: 'Simulate Trigger',
        name: 'simulateTrigger',
        subtitle: '={{$parameter.subtitle || undefined}}',
        icon: 'fa:arrow-right',
        group: ['trigger'],
        version: 1,
        description: 'Simulate a trigger node',
        defaults: {
            name: 'Simulate Trigger',
            color: '#b0b0b0',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            { ...descriptions_1.iconSelector, default: 'n8n-nodes-base.manualTrigger' },
            descriptions_1.subtitleProperty,
            { ...descriptions_1.jsonOutputProperty, displayName: 'Output (JSON)' },
            descriptions_1.executionDurationProperty,
        ],
    };
    methods = { loadOptions: methods_1.loadOptions };
    async trigger() {
        const returnItems = [];
        let jsonOutput = this.getNodeParameter('jsonOutput', 0);
        if (typeof jsonOutput === 'string') {
            try {
                jsonOutput = (0, n8n_workflow_1.jsonParse)(jsonOutput);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid JSON');
            }
        }
        if (!Array.isArray(jsonOutput)) {
            jsonOutput = [jsonOutput];
        }
        for (const item of jsonOutput) {
            returnItems.push({ json: item });
        }
        const executionDuration = this.getNodeParameter('executionDuration', 0);
        if (executionDuration > 0) {
            await (0, n8n_workflow_1.sleep)(executionDuration);
        }
        const manualTriggerFunction = async () => {
            this.emit([returnItems]);
        };
        return {
            manualTriggerFunction,
        };
    }
}
exports.SimulateTrigger = SimulateTrigger;
//# sourceMappingURL=SimulateTrigger.node.js.map
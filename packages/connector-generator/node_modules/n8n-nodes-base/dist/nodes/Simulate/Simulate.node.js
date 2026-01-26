"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulate = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const methods_1 = require("./methods");
class Simulate {
    description = {
        displayName: 'Simulate',
        hidden: true,
        name: 'simulate',
        group: ['organization'],
        version: 1,
        description: 'Simulate a node',
        subtitle: '={{$parameter.subtitle || undefined}}',
        icon: 'fa:arrow-right',
        defaults: {
            name: 'Simulate',
            color: '#b0b0b0',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            descriptions_1.iconSelector,
            descriptions_1.subtitleProperty,
            {
                displayName: 'Output',
                name: 'output',
                type: 'options',
                default: 'all',
                noDataExpression: true,
                options: [
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'Returns all input items',
                        value: 'all',
                    },
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'Specify how many of input items to return',
                        value: 'specify',
                    },
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'Specify output as JSON',
                        value: 'custom',
                    },
                ],
            },
            {
                displayName: 'Number of Items',
                name: 'numberOfItems',
                type: 'number',
                default: 1,
                description: 'Number input of items to return, if greater then input length all items will be returned',
                displayOptions: {
                    show: {
                        output: ['specify'],
                    },
                },
                typeOptions: {
                    minValue: 1,
                },
            },
            {
                ...descriptions_1.jsonOutputProperty,
                displayOptions: {
                    show: {
                        output: ['custom'],
                    },
                },
            },
            descriptions_1.executionDurationProperty,
        ],
    };
    methods = { loadOptions: methods_1.loadOptions };
    async execute() {
        const items = this.getInputData();
        let returnItems = [];
        const output = this.getNodeParameter('output', 0);
        if (output === 'all') {
            returnItems = items;
        }
        else if (output === 'specify') {
            const numberOfItems = this.getNodeParameter('numberOfItems', 0);
            returnItems = items.slice(0, numberOfItems);
        }
        else if (output === 'custom') {
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
        }
        const executionDuration = this.getNodeParameter('executionDuration', 0);
        if (executionDuration > 0) {
            await (0, n8n_workflow_1.sleep)(executionDuration);
        }
        return [returnItems];
    }
}
exports.Simulate = Simulate;
//# sourceMappingURL=Simulate.node.js.map
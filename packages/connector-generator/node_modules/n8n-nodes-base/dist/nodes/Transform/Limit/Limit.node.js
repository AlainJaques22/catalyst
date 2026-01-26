"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Limit = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Limit {
    description = {
        displayName: 'Limit',
        name: 'limit',
        icon: 'file:limit.svg',
        group: ['transform'],
        subtitle: '',
        version: 1,
        description: 'Restrict the number of items',
        defaults: {
            name: 'Limit',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Max Items',
                name: 'maxItems',
                type: 'number',
                typeOptions: {
                    minValue: 1,
                },
                default: 1,
                description: 'If there are more items than this number, some are removed',
            },
            {
                displayName: 'Keep',
                name: 'keep',
                type: 'options',
                options: [
                    {
                        name: 'First Items',
                        value: 'firstItems',
                    },
                    {
                        name: 'Last Items',
                        value: 'lastItems',
                    },
                ],
                default: 'firstItems',
                description: 'When removing items, whether to keep the ones at the start or the ending',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        let returnData = items;
        const maxItems = this.getNodeParameter('maxItems', 0);
        const keep = this.getNodeParameter('keep', 0);
        if (maxItems > items.length) {
            return [returnData];
        }
        if (keep === 'firstItems') {
            returnData = items.slice(0, maxItems);
        }
        else {
            returnData = items.slice(items.length - maxItems, items.length);
        }
        return [returnData];
    }
}
exports.Limit = Limit;
//# sourceMappingURL=Limit.node.js.map
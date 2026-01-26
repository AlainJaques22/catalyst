"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nTrainingCustomerMessenger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class N8nTrainingCustomerMessenger {
    description = {
        displayName: 'Customer Messenger (n8n training)',
        name: 'n8nTrainingCustomerMessenger',
        icon: {
            light: 'file:n8nTrainingCustomerMessenger.svg',
            dark: 'file:n8nTrainingCustomerMessenger.dark.svg',
        },
        group: ['transform'],
        version: 1,
        description: 'Dummy node used for n8n training',
        defaults: {
            name: 'Customer Messenger (n8n training)',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Customer ID',
                name: 'customerId',
                type: 'string',
                required: true,
                default: '',
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                required: true,
                typeOptions: {
                    rows: 4,
                },
                default: '',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        let responseData;
        for (let i = 0; i < length; i++) {
            const customerId = this.getNodeParameter('customerId', i);
            const message = this.getNodeParameter('message', i);
            responseData = { output: `Sent message to customer ${customerId}:  ${message}` };
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.N8nTrainingCustomerMessenger = N8nTrainingCustomerMessenger;
//# sourceMappingURL=N8nTrainingCustomerMessenger.node.js.map
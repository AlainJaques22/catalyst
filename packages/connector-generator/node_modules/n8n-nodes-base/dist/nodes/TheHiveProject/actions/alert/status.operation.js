"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.alertRLC,
    {
        displayName: 'Status Name or ID',
        name: 'status',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'loadAlertStatus',
        },
    },
];
const displayOptions = {
    show: {
        resource: ['alert'],
        operation: ['status'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const alertId = this.getNodeParameter('alertId', i, '', { extractValue: true });
    const status = this.getNodeParameter('status', i);
    await transport_1.theHiveApiRequest.call(this, 'PATCH', `/v1/alert/${alertId}`, { status });
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)({ success: true }), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=status.operation.js.map
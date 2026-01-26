"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
        displayName: 'Add to',
        name: 'addTo',
        type: 'options',
        options: [
            {
                name: 'Alert',
                value: 'alert',
            },
            {
                name: 'Case',
                value: 'case',
            },
        ],
        default: 'alert',
    },
    {
        ...descriptions_1.caseRLC,
        name: 'id',
        displayOptions: {
            show: {
                addTo: ['case'],
            },
        },
    },
    {
        ...descriptions_1.alertRLC,
        name: 'id',
        displayOptions: {
            show: {
                addTo: ['alert'],
            },
        },
    },
    {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
        typeOptions: {
            rows: 2,
        },
    },
];
const displayOptions = {
    show: {
        resource: ['comment'],
        operation: ['add'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    let responseData = [];
    const addTo = this.getNodeParameter('addTo', i);
    const id = this.getNodeParameter('id', i, '', { extractValue: true });
    const message = this.getNodeParameter('message', i);
    const body = {
        message,
    };
    responseData = await transport_1.theHiveApiRequest.call(this, 'POST', `/v1/${addTo}/${id}/comment`, body);
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=add.operation.js.map
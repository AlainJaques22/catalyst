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
        displayName: 'Options',
        name: 'options',
        placeholder: 'Add Field',
        type: 'collection',
        default: {},
        options: [
            {
                displayName: 'Case Template Name or ID',
                name: 'caseTemplate',
                type: 'options',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                default: '',
                typeOptions: {
                    loadOptionsMethod: 'loadCaseTemplate',
                },
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['alert'],
        operation: ['promote'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    let responseData = [];
    const alertId = this.getNodeParameter('alertId', i, '', { extractValue: true });
    const caseTemplate = this.getNodeParameter('options.caseTemplate', i, '');
    const body = {};
    // await theHiveApiRequest.call(this, 'POST', '/v1/caseTemplate', {
    // 	name: 'test template 001',
    // 	displayName: 'Test Template 001',
    // 	description: 'test',
    // });
    if (caseTemplate) {
        body.caseTemplate = caseTemplate;
    }
    responseData = await transport_1.theHiveApiRequest.call(this, 'POST', `/v1/alert/${alertId}/case`, body);
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=promote.operation.js.map
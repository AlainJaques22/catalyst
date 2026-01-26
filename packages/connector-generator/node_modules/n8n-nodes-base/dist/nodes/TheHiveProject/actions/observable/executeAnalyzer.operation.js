"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.observableRLC,
    descriptions_1.observableTypeOptions,
    {
        displayName: 'Analyzer Names or IDs',
        name: 'analyzers',
        type: 'multiOptions',
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        required: true,
        default: [],
        typeOptions: {
            loadOptionsDependsOn: ['observableId.value', 'dataType'],
            loadOptionsMethod: 'loadAnalyzers',
        },
        displayOptions: {
            hide: {
                id: [''],
            },
        },
    },
];
const displayOptions = {
    show: {
        resource: ['observable'],
        operation: ['executeAnalyzer'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    let responseData = {};
    const observableId = this.getNodeParameter('observableId', i, '', {
        extractValue: true,
    });
    const analyzers = this.getNodeParameter('analyzers', i).map((analyzer) => {
        const parts = analyzer.split('::');
        return {
            analyzerId: parts[0],
            cortexId: parts[1],
        };
    });
    let response;
    let body;
    const qs = {};
    for (const analyzer of analyzers) {
        body = {
            ...analyzer,
            artifactId: observableId,
        };
        // execute the analyzer
        response = await transport_1.theHiveApiRequest.call(this, 'POST', '/connector/cortex/job', body, qs);
        const jobId = response.id;
        qs.name = 'observable-jobs';
        // query the job result (including the report)
        do {
            responseData = await transport_1.theHiveApiRequest.call(this, 'GET', `/connector/cortex/job/${jobId}`, body, qs);
        } while (responseData.status === 'Waiting' || responseData.status === 'InProgress');
    }
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=executeAnalyzer.operation.js.map
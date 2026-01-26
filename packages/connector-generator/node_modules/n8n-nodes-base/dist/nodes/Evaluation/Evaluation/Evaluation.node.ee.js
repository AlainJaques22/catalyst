"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluation = void 0;
const n8n_workflow_1 = require("n8n-workflow"); // See packages/workflow/src/evaluation-helpers.ts
const Description_node_1 = require("./Description.node");
const versionDescription_1 = require("../../Google/Sheet/v2/actions/versionDescription");
const methods_1 = require("../methods");
const evaluationUtils_1 = require("../utils/evaluationUtils");
class Evaluation {
    description = {
        displayName: 'Evaluation',
        icon: 'fa:check-double',
        name: 'evaluation',
        group: ['transform'],
        version: [4.6, 4.7, 4.8],
        description: 'Runs an evaluation',
        eventTriggerDescription: '',
        subtitle: '={{$parameter["operation"]}}',
        defaults: {
            name: 'Evaluation',
            color: '#c3c9d5',
        },
        // Pass function explicitly since expression context doesn't allow imports in getInputConnectionTypes
        inputs: `={{(${evaluationUtils_1.getInputConnectionTypes})($parameter, ${n8n_workflow_1.metricRequiresModelConnection})}}`,
        outputs: `={{(${evaluationUtils_1.getOutputConnectionTypes})($parameter)}}`,
        codex: {
            alias: ['Test', 'Metrics', 'Evals', 'Set Output', 'Set Metrics'],
        },
        credentials: [
            {
                name: 'googleApi',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['serviceAccount'],
                        operation: ['setOutputs'],
                    },
                },
                testedBy: 'googleApiCredentialTest',
            },
            {
                name: 'googleSheetsOAuth2Api',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['oAuth2'],
                        operation: ['setOutputs'],
                    },
                },
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Set Inputs',
                        value: 'setInputs',
                    },
                    {
                        name: 'Set Outputs',
                        value: 'setOutputs',
                    },
                    {
                        name: 'Set Metrics',
                        value: 'setMetrics',
                    },
                    {
                        name: 'Check If Evaluating',
                        value: 'checkIfEvaluating',
                    },
                ],
                default: 'setOutputs',
            },
            {
                ...Description_node_1.sourcePicker,
                default: 'dataTable',
                displayOptions: {
                    show: { '@version': [{ _cnd: { gte: 4.8 } }], operation: ['setOutputs'] },
                },
            },
            {
                ...Description_node_1.sourcePicker,
                default: 'googleSheets',
                displayOptions: {
                    show: { '@version': [{ _cnd: { lte: 4.7 } }], operation: ['setOutputs'] },
                },
            },
            {
                ...versionDescription_1.authentication,
                displayOptions: {
                    hide: {
                        source: ['dataTable'],
                    },
                },
            },
            ...Description_node_1.setInputsProperties,
            ...Description_node_1.setOutputProperties,
            ...Description_node_1.setMetricsProperties,
            ...Description_node_1.setCheckIfEvaluatingProperties,
        ],
    };
    methods = { loadOptions: methods_1.loadOptions, listSearch: methods_1.listSearch, credentialTest: methods_1.credentialTest };
    async execute() {
        const operation = this.getNodeParameter('operation', 0);
        if (operation === 'setOutputs') {
            return await evaluationUtils_1.setOutputs.call(this);
        }
        else if (operation === 'setInputs') {
            return evaluationUtils_1.setInputs.call(this);
        }
        else if (operation === 'setMetrics') {
            return await evaluationUtils_1.setMetrics.call(this);
        }
        else if (operation === 'checkIfEvaluating') {
            return await evaluationUtils_1.checkIfEvaluating.call(this);
        }
        throw new Error('Unsupported Operation');
    }
}
exports.Evaluation = Evaluation;
//# sourceMappingURL=Evaluation.node.ee.js.map
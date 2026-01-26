"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metabase = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const AlertsDescription_1 = require("./AlertsDescription");
const DatabasesDescription_1 = require("./DatabasesDescription");
const MetricsDescription_1 = require("./MetricsDescription");
const QuestionsDescription_1 = require("./QuestionsDescription");
class Metabase {
    description = {
        displayName: 'Metabase',
        name: 'metabase',
        icon: 'file:metabase.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Use the Metabase API',
        defaults: {
            name: 'Metabase',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'metabaseApi',
                required: true,
            },
        ],
        requestDefaults: {
            returnFullResponse: true,
            baseURL: '={{$credentials.url.replace(new RegExp("/$"), "")}}',
            headers: {},
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Alert',
                        value: 'alerts',
                    },
                    {
                        name: 'Database',
                        value: 'databases',
                    },
                    {
                        name: 'Metric',
                        value: 'metrics',
                    },
                    {
                        name: 'Question',
                        value: 'questions',
                    },
                ],
                default: 'questions',
            },
            ...QuestionsDescription_1.questionsOperations,
            ...QuestionsDescription_1.questionsFields,
            ...MetricsDescription_1.metricsOperations,
            ...MetricsDescription_1.metricsFields,
            ...DatabasesDescription_1.databasesOperations,
            ...DatabasesDescription_1.databasesFields,
            ...AlertsDescription_1.alertsOperations,
            ...AlertsDescription_1.alertsFields,
        ],
    };
}
exports.Metabase = Metabase;
//# sourceMappingURL=Metabase.node.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitWell = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const CompanyDescription_1 = require("./CompanyDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const MetricDescription_1 = require("./MetricDescription");
class ProfitWell {
    description = {
        displayName: 'ProfitWell',
        name: 'profitWell',
        icon: { light: 'file:profitwell.svg', dark: 'file:profitwell.dark.svg' },
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume ProfitWell API',
        defaults: {
            name: 'ProfitWell',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'profitWellApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Company',
                        value: 'company',
                    },
                    {
                        name: 'Metric',
                        value: 'metric',
                    },
                ],
                default: 'metric',
            },
            // COMPANY
            ...CompanyDescription_1.companyOperations,
            // METRICS
            ...MetricDescription_1.metricOperations,
            ...MetricDescription_1.metricFields,
        ],
    };
    methods = {
        loadOptions: {
            async getPlanIds() {
                const returnData = [];
                const planIds = await GenericFunctions_1.profitWellApiRequest.call(this, 'GET', '/metrics/plans');
                for (const planId of planIds.plan_ids) {
                    returnData.push({
                        name: planId,
                        value: planId,
                    });
                }
                return returnData;
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        const qs = {};
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < length; i++) {
            try {
                if (resource === 'company') {
                    if (operation === 'getSetting') {
                        responseData = await GenericFunctions_1.profitWellApiRequest.call(this, 'GET', '/company/settings/');
                    }
                }
                if (resource === 'metric') {
                    if (operation === 'get') {
                        const type = this.getNodeParameter('type', i);
                        const simple = this.getNodeParameter('simple', 0);
                        if (type === 'daily') {
                            qs.month = this.getNodeParameter('month', i);
                        }
                        const options = this.getNodeParameter('options', i);
                        Object.assign(qs, options);
                        if (qs.dailyMetrics) {
                            qs.metrics = qs.dailyMetrics.join(',');
                            delete qs.dailyMetrics;
                        }
                        if (qs.monthlyMetrics) {
                            qs.metrics = qs.monthlyMetrics.join(',');
                            delete qs.monthlyMetrics;
                        }
                        responseData = await GenericFunctions_1.profitWellApiRequest.call(this, 'GET', `/metrics/${type}`, {}, qs);
                        responseData = responseData.data;
                        if (simple) {
                            if (type === 'daily') {
                                responseData = (0, GenericFunctions_1.simplifyDailyMetrics)(responseData);
                            }
                            else {
                                responseData = (0, GenericFunctions_1.simplifyMontlyMetrics)(responseData);
                            }
                        }
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.ProfitWell = ProfitWell;
//# sourceMappingURL=ProfitWell.node.js.map
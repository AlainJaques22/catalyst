"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oura = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ProfileDescription_1 = require("./ProfileDescription");
const SummaryDescription_1 = require("./SummaryDescription");
class Oura {
    description = {
        displayName: 'Oura',
        name: 'oura',
        icon: { light: 'file:oura.svg', dark: 'file:oura.dark.svg' },
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Oura API',
        defaults: {
            name: 'Oura',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'ouraApi',
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
                        name: 'Profile',
                        value: 'profile',
                    },
                    {
                        name: 'Summary',
                        value: 'summary',
                    },
                ],
                default: 'summary',
            },
            ...ProfileDescription_1.profileOperations,
            ...SummaryDescription_1.summaryOperations,
            ...SummaryDescription_1.summaryFields,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const length = items.length;
        let responseData;
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < length; i++) {
            try {
                if (resource === 'profile') {
                    // *********************************************************************
                    //                             profile
                    // *********************************************************************
                    // https://cloud.ouraring.com/docs/personal-info
                    if (operation === 'get') {
                        // ----------------------------------
                        //         profile: get
                        // ----------------------------------
                        responseData = await GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/usercollection/personal_info');
                    }
                }
                else if (resource === 'summary') {
                    // *********************************************************************
                    //                             summary
                    // *********************************************************************
                    // https://cloud.ouraring.com/docs/daily-summaries
                    const qs = {};
                    const { start, end } = this.getNodeParameter('filters', i);
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    if (start) {
                        qs.start_date = (0, moment_timezone_1.default)(start).format('YYYY-MM-DD');
                    }
                    if (end) {
                        qs.end_date = (0, moment_timezone_1.default)(end).format('YYYY-MM-DD');
                    }
                    if (operation === 'getActivity') {
                        // ----------------------------------
                        //       profile: getActivity
                        // ----------------------------------
                        responseData = await GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/usercollection/daily_activity', {}, qs);
                        responseData = responseData.data;
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                    else if (operation === 'getReadiness') {
                        // ----------------------------------
                        //       profile: getReadiness
                        // ----------------------------------
                        responseData = await GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/usercollection/daily_readiness', {}, qs);
                        responseData = responseData.data;
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                    else if (operation === 'getSleep') {
                        // ----------------------------------
                        //         profile: getSleep
                        // ----------------------------------
                        responseData = await GenericFunctions_1.ouraApiRequest.call(this, 'GET', '/usercollection/daily_sleep', {}, qs);
                        responseData = responseData.data;
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', 0);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Oura = Oura;
//# sourceMappingURL=Oura.node.js.map
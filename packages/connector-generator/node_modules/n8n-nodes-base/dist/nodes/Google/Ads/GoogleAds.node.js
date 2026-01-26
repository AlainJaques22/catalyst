"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAds = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const CampaignDescription_1 = require("./CampaignDescription");
class GoogleAds {
    description = {
        displayName: 'Google Ads',
        name: 'googleAds',
        icon: 'file:googleAds.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Use the Google Ads API',
        defaults: {
            name: 'Google Ads',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'googleAdsOAuth2Api',
                required: true,
                testedBy: {
                    request: {
                        method: 'GET',
                        url: '/v20/customers:listAccessibleCustomers',
                    },
                },
            },
        ],
        requestDefaults: {
            returnFullResponse: true,
            baseURL: 'https://googleads.googleapis.com',
            headers: {
                'developer-token': '={{$credentials.developerToken}}',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Campaign',
                        value: 'campaign',
                    },
                ],
                default: 'campaign',
            },
            //-------------------------------
            // Campaign Operations
            //-------------------------------
            ...CampaignDescription_1.campaignOperations,
            {
                displayName: 'Divide field names expressed with <i>micros</i> by 1,000,000 to get the actual value',
                name: 'campaigsNotice',
                type: 'notice',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                    },
                },
            },
            ...CampaignDescription_1.campaignFields,
        ],
    };
}
exports.GoogleAds = GoogleAds;
//# sourceMappingURL=GoogleAds.node.js.map
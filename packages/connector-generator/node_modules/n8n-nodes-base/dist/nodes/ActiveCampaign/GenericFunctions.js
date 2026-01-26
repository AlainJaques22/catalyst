"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeCampaignApiRequest = activeCampaignApiRequest;
exports.activeCampaignApiRequestAllItems = activeCampaignApiRequestAllItems;
exports.activeCampaignDefaultGetAllProperties = activeCampaignDefaultGetAllProperties;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to ActiveCampaign
 *
 */
async function activeCampaignApiRequest(method, endpoint, body, query, dataKey) {
    const credentials = await this.getCredentials('activeCampaignApi');
    if (query === undefined) {
        query = {};
    }
    const options = {
        headers: {},
        method,
        qs: query,
        uri: `${credentials.apiUrl}${endpoint}`,
        json: true,
    };
    if (Object.keys(body).length !== 0) {
        options.body = body;
    }
    try {
        const responseData = await this.helpers.requestWithAuthentication.call(this, 'activeCampaignApi', options);
        if (responseData.success === false) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
        }
        if (dataKey === undefined) {
            return responseData;
        }
        else {
            return responseData[dataKey];
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an API request to paginated ActiveCampaign endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
async function activeCampaignApiRequestAllItems(method, endpoint, body, query, dataKey) {
    if (query === undefined) {
        query = {};
    }
    query.limit = 100;
    query.offset = 0;
    const returnData = [];
    let responseData;
    let itemsReceived = 0;
    do {
        responseData = await activeCampaignApiRequest.call(this, method, endpoint, body, query);
        if (dataKey === undefined) {
            returnData.push.apply(returnData, responseData);
            if (returnData !== undefined) {
                itemsReceived += returnData.length;
            }
        }
        else {
            returnData.push.apply(returnData, responseData[dataKey]);
            if (responseData[dataKey] !== undefined) {
                itemsReceived += responseData[dataKey].length;
            }
        }
        query.offset = itemsReceived;
    } while (responseData.meta?.total !== undefined && responseData.meta.total > itemsReceived);
    return returnData;
}
function activeCampaignDefaultGetAllProperties(resource, operation) {
    return [
        {
            displayName: 'Return All',
            name: 'returnAll',
            type: 'boolean',
            displayOptions: {
                show: {
                    operation: [operation],
                    resource: [resource],
                },
            },
            default: false,
            description: 'Whether to return all results or only up to a given limit',
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            displayOptions: {
                show: {
                    operation: [operation],
                    resource: [resource],
                    returnAll: [false],
                },
            },
            typeOptions: {
                minValue: 1,
                maxValue: 500,
            },
            default: 100,
            description: 'Max number of results to return',
        },
        {
            displayName: 'Simplify',
            name: 'simple',
            type: 'boolean',
            displayOptions: {
                show: {
                    operation: [operation],
                    resource: [resource],
                },
            },
            default: true,
            description: 'Whether to return a simplified version of the response instead of the raw data',
        },
    ];
}
//# sourceMappingURL=GenericFunctions.js.map
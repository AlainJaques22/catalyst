"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemlistV1 = void 0;
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const omit_1 = __importDefault(require("lodash/omit"));
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("../GenericFunctions");
const versionDescription = {
    displayName: 'Lemlist',
    name: 'lemlist',
    icon: 'file:lemlist.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume the Lemlist API',
    defaults: {
        name: 'Lemlist',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'lemlistApi',
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
                    name: 'Activity',
                    value: 'activity',
                },
                {
                    name: 'Campaign',
                    value: 'campaign',
                },
                {
                    name: 'Lead',
                    value: 'lead',
                },
                {
                    name: 'Team',
                    value: 'team',
                },
                {
                    name: 'Unsubscribe',
                    value: 'unsubscribe',
                },
            ],
            default: 'activity',
        },
        ...descriptions_1.activityOperations,
        ...descriptions_1.activityFields,
        ...descriptions_1.campaignOperations,
        ...descriptions_1.campaignFields,
        ...descriptions_1.leadOperations,
        ...descriptions_1.leadFields,
        ...descriptions_1.teamOperations,
        ...descriptions_1.teamFields,
        ...descriptions_1.unsubscribeOperations,
        ...descriptions_1.unsubscribeFields,
    ],
};
class LemlistV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }
    methods = {
        loadOptions: {
            async getCampaigns() {
                const campaigns = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/campaigns');
                return campaigns.map(({ _id, name }) => ({
                    name,
                    value: _id,
                }));
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'activity') {
                    // *********************************************************************
                    //                             activity
                    // *********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //        activity: getAll
                        // ----------------------------------
                        // https://developer.lemlist.com/#activities
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        if (!(0, isEmpty_1.default)(filters)) {
                            Object.assign(qs, filters);
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.lemlistApiRequestAllItems.call(this, 'GET', '/activities', qs);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/activities', {}, qs);
                        }
                    }
                }
                else if (resource === 'campaign') {
                    // *********************************************************************
                    //                             campaign
                    // *********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //        campaign: getAll
                        // ----------------------------------
                        // https://developer.lemlist.com/#list-all-campaigns
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.lemlistApiRequestAllItems.call(this, 'GET', '/campaigns', {});
                        }
                        else {
                            const qs = {
                                limit: this.getNodeParameter('limit', i),
                            };
                            responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/campaigns', {}, qs);
                        }
                    }
                }
                else if (resource === 'lead') {
                    // *********************************************************************
                    //                             lead
                    // *********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //          lead: create
                        // ----------------------------------
                        // https://developer.lemlist.com/#add-a-lead-in-a-campaign
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.deduplicate !== undefined) {
                            qs.deduplicate = additionalFields.deduplicate;
                        }
                        const body = {};
                        const remainingAdditionalFields = (0, omit_1.default)(additionalFields, 'deduplicate');
                        if (!(0, isEmpty_1.default)(remainingAdditionalFields)) {
                            Object.assign(body, remainingAdditionalFields);
                        }
                        const campaignId = this.getNodeParameter('campaignId', i);
                        const email = this.getNodeParameter('email', i);
                        const endpoint = `/campaigns/${campaignId}/leads/${email}`;
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'POST', endpoint, body, qs);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //         lead: delete
                        // ----------------------------------
                        // https://developer.lemlist.com/#delete-a-lead-from-a-campaign
                        const campaignId = this.getNodeParameter('campaignId', i);
                        const email = this.getNodeParameter('email', i);
                        const endpoint = `/campaigns/${campaignId}/leads/${email}`;
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', endpoint, {}, { action: 'remove' });
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //         lead: get
                        // ----------------------------------
                        // https://developer.lemlist.com/#get-a-specific-lead-by-email
                        const email = this.getNodeParameter('email', i);
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', `/leads/${email}`);
                    }
                    else if (operation === 'unsubscribe') {
                        // ----------------------------------
                        //         lead: unsubscribe
                        // ----------------------------------
                        // https://developer.lemlist.com/#unsubscribe-a-lead-from-a-campaign
                        const campaignId = this.getNodeParameter('campaignId', i);
                        const email = this.getNodeParameter('email', i);
                        const endpoint = `/campaigns/${campaignId}/leads/${email}`;
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', endpoint);
                    }
                }
                else if (resource === 'team') {
                    // *********************************************************************
                    //                             team
                    // *********************************************************************
                    if (operation === 'get') {
                        // ----------------------------------
                        //         team: get
                        // ----------------------------------
                        // https://developer.lemlist.com/#team
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/team');
                    }
                }
                else if (resource === 'unsubscribe') {
                    // *********************************************************************
                    //                             unsubscribe
                    // *********************************************************************
                    if (operation === 'add') {
                        // ----------------------------------
                        //        unsubscribe: Add
                        // ----------------------------------
                        // https://developer.lemlist.com/#add-an-email-address-in-the-unsubscribes
                        const email = this.getNodeParameter('email', i);
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'POST', `/unsubscribes/${email}`);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------
                        //        unsubscribe: delete
                        // ----------------------------------
                        // https://developer.lemlist.com/#delete-an-email-address-from-the-unsubscribes
                        const email = this.getNodeParameter('email', i);
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'DELETE', `/unsubscribes/${email}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //        unsubscribe: getAll
                        // ----------------------------------
                        // https://developer.lemlist.com/#list-all-unsubscribes
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.lemlistApiRequestAllItems.call(this, 'GET', '/unsubscribes', {});
                        }
                        else {
                            const qs = {
                                limit: this.getNodeParameter('limit', i),
                            };
                            responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/unsubscribes', {}, qs);
                        }
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.LemlistV1 = LemlistV1;
//# sourceMappingURL=LemlistV1.node.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemlistV2 = void 0;
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
    version: 2,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume the Lemlist API',
    defaults: {
        name: 'Lemlist',
    },
    usableAsTool: true,
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
                    name: 'Enrichment',
                    value: 'enrich',
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
        ...descriptions_1.enrichmentOperations,
        ...descriptions_1.enrichmentFields,
        ...descriptions_1.leadOperations,
        ...descriptions_1.leadFields,
        ...descriptions_1.teamOperations,
        ...descriptions_1.teamFields,
        ...descriptions_1.unsubscribeOperations,
        ...descriptions_1.unsubscribeFields,
    ],
};
class LemlistV2 {
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
                        // https://developer.lemlist.com/#32ab1bf9-9b2f-40ed-9bbd-0b8370fed3d9
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        if (!(0, isEmpty_1.default)(filters)) {
                            Object.assign(qs, filters);
                        }
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.lemlistApiRequestAllItems.call(this, 'GET', '/campaigns', {});
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/campaigns', {}, qs);
                        }
                    }
                    else if (operation === 'getStats') {
                        // ----------------------------------
                        //        campaign: getStats
                        // ----------------------------------
                        // https://developer.lemlist.com/#0b5cc72c-c1c8-47d0-a086-32b1b63522e3
                        const qs = {};
                        const campaignId = this.getNodeParameter('campaignId', i);
                        qs.startDate = this.getNodeParameter('startDate', i);
                        qs.endDate = this.getNodeParameter('endDate', i);
                        qs.timezone = this.getNodeParameter('timezone', i);
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', `/campaigns/${campaignId}/stats`, {}, qs);
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
                    else if (operation === 'getCredits') {
                        // ----------------------------------
                        //         team: getCredits
                        // ----------------------------------
                        // https://developer.lemlist.com/#c9af1cf3-8d3d-469e-a548-268b579d2cb3
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', '/team/credits');
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
                else if (resource === 'enrich') {
                    // *********************************************************************
                    //                             enrichment
                    // *********************************************************************
                    if (operation === 'get') {
                        // ----------------------------------
                        //        enrichment: get
                        // ----------------------------------
                        // https://developer.lemlist.com/#71b74cc3-8098-4389-b3c2-67a027df9407
                        const enrichId = this.getNodeParameter('enrichId', i);
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'GET', `/enrich/${enrichId}`);
                    }
                    else if (operation === 'enrichLead') {
                        // https://developer.lemlist.com/#fe2a52fc-fa73-46d0-8b7d-395d9653bfd5
                        const findEmail = this.getNodeParameter('findEmail', i);
                        const verifyEmail = this.getNodeParameter('verifyEmail', i);
                        const linkedinEnrichment = this.getNodeParameter('linkedinEnrichment', i);
                        const findPhone = this.getNodeParameter('findPhone', i);
                        const qs = {};
                        qs.findEmail = findEmail;
                        qs.verifyEmail = verifyEmail;
                        qs.linkedinEnrichment = linkedinEnrichment;
                        qs.findPhone = findPhone;
                        const body = {};
                        const leadId = this.getNodeParameter('leadId', i);
                        const endpoint = `/leads/${leadId}/enrich/`;
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'POST', endpoint, body, qs);
                    }
                    else if (operation === 'enrichPerson') {
                        // https://developer.lemlist.com/#4ba3d505-0bfa-4f36-8549-f3cb343786bf
                        const findEmail = this.getNodeParameter('findEmail', i);
                        const verifyEmail = this.getNodeParameter('verifyEmail', i);
                        const linkedinEnrichment = this.getNodeParameter('linkedinEnrichment', i);
                        const findPhone = this.getNodeParameter('findPhone', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const qs = {};
                        if (!(0, isEmpty_1.default)(additionalFields)) {
                            Object.assign(qs, additionalFields);
                        }
                        qs.findEmail = findEmail;
                        qs.verifyEmail = verifyEmail;
                        qs.linkedinEnrichment = linkedinEnrichment;
                        qs.findPhone = findPhone;
                        const body = {};
                        const endpoint = '/enrich/';
                        responseData = await GenericFunctions_1.lemlistApiRequest.call(this, 'POST', endpoint, body, qs);
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
exports.LemlistV2 = LemlistV2;
//# sourceMappingURL=LemlistV2.node.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplunkV1 = void 0;
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_2 = require("../../../utils/descriptions");
const versionDescription = {
    displayName: 'Splunk',
    name: 'splunk',
    icon: 'file:splunk.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume the Splunk Enterprise API',
    defaults: {
        name: 'Splunk',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'splunkApi',
            required: true,
        },
    ],
    properties: [
        descriptions_2.oldVersionNotice,
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Fired Alert',
                    value: 'firedAlert',
                },
                {
                    name: 'Search Configuration',
                    value: 'searchConfiguration',
                },
                {
                    name: 'Search Job',
                    value: 'searchJob',
                },
                {
                    name: 'Search Result',
                    value: 'searchResult',
                },
                {
                    name: 'User',
                    value: 'user',
                },
            ],
            default: 'searchJob',
        },
        ...descriptions_1.firedAlertOperations,
        ...descriptions_1.searchConfigurationOperations,
        ...descriptions_1.searchConfigurationFields,
        ...descriptions_1.searchJobOperations,
        ...descriptions_1.searchJobFields,
        ...descriptions_1.searchResultOperations,
        ...descriptions_1.searchResultFields,
        ...descriptions_1.userOperations,
        ...descriptions_1.userFields,
    ],
};
class SplunkV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }
    methods = {
        loadOptions: {
            async getRoles() {
                const endpoint = '/services/authorization/roles';
                const responseData = (await GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint));
                const { entry: entries } = responseData.feed;
                return Array.isArray(entries)
                    ? entries.map((entry) => ({ name: entry.title, value: entry.title }))
                    : [{ name: entries.title, value: entries.title }];
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'firedAlert') {
                    // **********************************************************************
                    //                               firedAlert
                    // **********************************************************************
                    if (operation === 'getReport') {
                        // ----------------------------------------
                        //            firedAlert: getReport
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#alerts.2Ffired_alerts
                        const endpoint = '/services/alerts/fired_alerts';
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatFeed);
                    }
                }
                else if (resource === 'searchConfiguration') {
                    // **********************************************************************
                    //                          searchConfiguration
                    // **********************************************************************
                    if (operation === 'delete') {
                        // ----------------------------------------
                        //       searchConfiguration: delete
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches.2F.7Bname.7D
                        const partialEndpoint = '/services/saved/searches/';
                        const searchConfigurationId = GenericFunctions_1.getId.call(this, i, 'searchConfigurationId', '/search/saved/searches/'); // id endpoint differs from operation endpoint
                        const endpoint = `${partialEndpoint}/${searchConfigurationId}`;
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'DELETE', endpoint);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //         searchConfiguration: get
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches.2F.7Bname.7D
                        const partialEndpoint = '/services/saved/searches/';
                        const searchConfigurationId = GenericFunctions_1.getId.call(this, i, 'searchConfigurationId', '/search/saved/searches/'); // id endpoint differs from operation endpoint
                        const endpoint = `${partialEndpoint}/${searchConfigurationId}`;
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatFeed);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //       searchConfiguration: getAll
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.populate)(options, qs);
                        GenericFunctions_1.setCount.call(this, qs);
                        const endpoint = '/services/saved/searches';
                        responseData = await GenericFunctions_1.splunkApiRequest
                            .call(this, 'GET', endpoint, {}, qs)
                            .then(GenericFunctions_1.formatFeed);
                    }
                }
                else if (resource === 'searchJob') {
                    // **********************************************************************
                    //                               searchJob
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //            searchJob: create
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs
                        const body = {
                            search: this.getNodeParameter('search', i),
                        };
                        const { earliest_time, latest_time, index_earliest, index_latest, ...rest } = this.getNodeParameter('additionalFields', i);
                        (0, GenericFunctions_1.populate)({
                            ...(earliest_time && { earliest_time: (0, GenericFunctions_1.toUnixEpoch)(earliest_time) }),
                            ...(latest_time && { latest_time: (0, GenericFunctions_1.toUnixEpoch)(latest_time) }),
                            ...(index_earliest && { index_earliest: (0, GenericFunctions_1.toUnixEpoch)(index_earliest) }),
                            ...(index_latest && { index_latest: (0, GenericFunctions_1.toUnixEpoch)(index_latest) }),
                            ...rest,
                        }, body);
                        const endpoint = '/services/search/jobs';
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'POST', endpoint, body);
                        const getEndpoint = `/services/search/jobs/${responseData.response.sid}`;
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'GET', getEndpoint).then(GenericFunctions_1.formatSearch);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //            searchJob: delete
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D
                        const partialEndpoint = '/services/search/jobs/';
                        const searchJobId = GenericFunctions_1.getId.call(this, i, 'searchJobId', partialEndpoint);
                        const endpoint = `${partialEndpoint}/${searchJobId}`;
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'DELETE', endpoint);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //              searchJob: get
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D
                        const partialEndpoint = '/services/search/jobs/';
                        const searchJobId = GenericFunctions_1.getId.call(this, i, 'searchJobId', partialEndpoint);
                        const endpoint = `${partialEndpoint}/${searchJobId}`;
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatSearch);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //            searchJob: getAll
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs
                        const qs = {};
                        const options = this.getNodeParameter('options', i);
                        (0, GenericFunctions_1.populate)(options, qs);
                        GenericFunctions_1.setCount.call(this, qs);
                        const endpoint = '/services/search/jobs';
                        responseData = (await GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint, {}, qs));
                        responseData = (0, GenericFunctions_1.formatFeed)(responseData);
                    }
                }
                else if (resource === 'searchResult') {
                    // **********************************************************************
                    //                              searchResult
                    // **********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------------
                        //           searchResult: getAll
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D.2Fresults
                        const searchJobId = this.getNodeParameter('searchJobId', i);
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        const options = this.getNodeParameter('options', i);
                        const keyValuePair = filters?.keyValueMatch?.keyValuePair;
                        if (keyValuePair?.key && keyValuePair?.value) {
                            qs.search = `search ${keyValuePair.key}=${keyValuePair.value}`;
                        }
                        (0, GenericFunctions_1.populate)(options, qs);
                        GenericFunctions_1.setCount.call(this, qs);
                        const endpoint = `/services/search/jobs/${searchJobId}/results`;
                        responseData = await GenericFunctions_1.splunkApiRequest
                            .call(this, 'GET', endpoint, {}, qs)
                            .then(GenericFunctions_1.formatResults);
                    }
                }
                else if (resource === 'user') {
                    // **********************************************************************
                    //                                  user
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               user: create
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers
                        const roles = this.getNodeParameter('roles', i);
                        const body = {
                            name: this.getNodeParameter('name', i),
                            roles,
                            password: this.getNodeParameter('password', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        (0, GenericFunctions_1.populate)(additionalFields, body);
                        const endpoint = '/services/authentication/users';
                        responseData = (await GenericFunctions_1.splunkApiRequest.call(this, 'POST', endpoint, body));
                        responseData = (0, GenericFunctions_1.formatFeed)(responseData);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               user: delete
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
                        const partialEndpoint = '/services/authentication/users';
                        const userId = GenericFunctions_1.getId.call(this, i, 'userId', partialEndpoint);
                        const endpoint = `${partialEndpoint}/${userId}`;
                        await GenericFunctions_1.splunkApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                user: get
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
                        const partialEndpoint = '/services/authentication/users/';
                        const userId = GenericFunctions_1.getId.call(this, i, 'userId', '/services/authentication/users/');
                        const endpoint = `${partialEndpoint}/${userId}`;
                        responseData = await GenericFunctions_1.splunkApiRequest.call(this, 'GET', endpoint).then(GenericFunctions_1.formatFeed);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               user: getAll
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers
                        const qs = {};
                        GenericFunctions_1.setCount.call(this, qs);
                        const endpoint = '/services/authentication/users';
                        responseData = await GenericFunctions_1.splunkApiRequest
                            .call(this, 'GET', endpoint, {}, qs)
                            .then(GenericFunctions_1.formatFeed);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               user: update
                        // ----------------------------------------
                        // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
                        const body = {};
                        const { roles, ...rest } = this.getNodeParameter('updateFields', i);
                        (0, GenericFunctions_1.populate)({
                            ...(roles && { roles }),
                            ...rest,
                        }, body);
                        const partialEndpoint = '/services/authentication/users/';
                        const userId = GenericFunctions_1.getId.call(this, i, 'userId', partialEndpoint);
                        const endpoint = `${partialEndpoint}/${userId}`;
                        responseData = await GenericFunctions_1.splunkApiRequest
                            .call(this, 'POST', endpoint, body)
                            .then(GenericFunctions_1.formatFeed);
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.cause.error }, pairedItem: { item: i } });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeApiError) {
                    (0, set_1.default)(error, 'context.itemIndex', i);
                }
                if (error instanceof n8n_workflow_1.NodeOperationError && error?.context?.itemIndex === undefined) {
                    (0, set_1.default)(error, 'context.itemIndex', i);
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex: i });
            }
            if (Array.isArray(responseData)) {
                for (const item of responseData) {
                    returnData.push({ json: item, pairedItem: { item: i } });
                }
            }
            else {
                returnData.push({ json: responseData, pairedItem: { item: i } });
            }
        }
        return [returnData];
    }
}
exports.SplunkV1 = SplunkV1;
//# sourceMappingURL=SplunkV1.node.js.map
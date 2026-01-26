"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.searchJobRLC,
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                returnAll: [false],
            },
        },
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        options: [
            {
                displayName: 'Key-Value Match',
                name: 'keyValueMatch',
                description: 'Key-value pair to match against. Example: if "Key" is set to <code>user</code> and "Field" is set to <code>john</code>, only the results where <code>user</code> is <code>john</code> will be returned.',
                type: 'fixedCollection',
                default: {},
                placeholder: 'Add Key-Value Pair',
                options: [
                    {
                        displayName: 'Key-Value Pair',
                        name: 'keyValuePair',
                        values: [
                            {
                                displayName: 'Key',
                                name: 'key',
                                description: 'Key to match against',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                description: 'Value to match against',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Add Summary to Metadata',
                name: 'add_summary_to_metadata',
                description: 'Whether to include field summary statistics in the response',
                type: 'boolean',
                default: false,
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['search'],
        operation: ['getResult'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D.2Fresults
    const searchJobId = this.getNodeParameter('searchJobId', i, '', { extractValue: true });
    const qs = {};
    const filters = this.getNodeParameter('filters', i);
    const options = this.getNodeParameter('options', i);
    const keyValuePair = filters?.keyValueMatch?.keyValuePair;
    if (keyValuePair?.key && keyValuePair?.value) {
        qs.search = `search ${keyValuePair.key}=${keyValuePair.value}`;
    }
    (0, utils_1.populate)(options, qs);
    utils_1.setReturnAllOrLimit.call(this, qs);
    const endpoint = `/services/search/jobs/${searchJobId}/results`;
    const returnData = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint, {}, qs);
    return returnData;
}
//# sourceMappingURL=getResult.operation.js.map
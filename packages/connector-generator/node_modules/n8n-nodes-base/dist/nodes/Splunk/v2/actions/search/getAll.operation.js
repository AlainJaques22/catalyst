"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
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
        displayName: 'Sort',
        name: 'sort',
        type: 'fixedCollection',
        default: {},
        options: [
            {
                displayName: 'Values',
                name: 'values',
                values: [
                    {
                        displayName: 'Sort Direction',
                        name: 'sort_dir',
                        type: 'options',
                        options: [
                            {
                                name: 'Ascending',
                                value: 'asc',
                            },
                            {
                                name: 'Descending',
                                value: 'desc',
                            },
                        ],
                        default: 'asc',
                    },
                    {
                        displayName: 'Sort Key',
                        name: 'sort_key',
                        description: 'Key name to use for sorting',
                        type: 'string',
                        placeholder: 'e.g. diskUsage',
                        default: '',
                    },
                    {
                        displayName: 'Sort Mode',
                        name: 'sort_mode',
                        type: 'options',
                        options: [
                            {
                                name: 'Automatic',
                                value: 'auto',
                                description: 'If all field values are numeric, collate numerically. Otherwise, collate alphabetically.',
                            },
                            {
                                name: 'Alphabetic',
                                value: 'alpha',
                                description: 'Collate alphabetically, case-insensitive',
                            },
                            {
                                name: 'Alphabetic and Case-Sensitive',
                                value: 'alpha_case',
                                description: 'Collate alphabetically, case-sensitive',
                            },
                            {
                                name: 'Numeric',
                                value: 'num',
                                description: 'Collate numerically',
                            },
                        ],
                        default: 'auto',
                    },
                ],
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['search'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs
    const qs = {};
    const sort = this.getNodeParameter('sort.values', i, {});
    (0, utils_1.populate)(sort, qs);
    utils_1.setReturnAllOrLimit.call(this, qs);
    const endpoint = '/services/search/jobs';
    const returnData = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint, {}, qs);
    return returnData;
}
//# sourceMappingURL=getAll.operation.js.map
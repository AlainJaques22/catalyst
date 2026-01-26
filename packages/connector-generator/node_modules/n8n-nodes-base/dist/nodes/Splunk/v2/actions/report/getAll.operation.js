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
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Add Orphan Field',
                name: 'add_orphan_field',
                description: 'Whether to include a boolean value for each saved search to show whether the search is orphaned, meaning that it has no valid owner',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'List Default Actions',
                name: 'listDefaultActionArgs',
                type: 'boolean',
                default: false,
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['report'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches
    const qs = {};
    const options = this.getNodeParameter('options', i);
    (0, utils_1.populate)(options, qs);
    utils_1.setReturnAllOrLimit.call(this, qs);
    const endpoint = '/services/saved/searches';
    const returnData = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint, {}, qs);
    return returnData;
}
//# sourceMappingURL=getAll.operation.js.map
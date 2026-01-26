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
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(_i) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers
    const qs = {};
    utils_1.setReturnAllOrLimit.call(this, qs);
    const endpoint = '/services/authentication/users';
    const returnData = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint, {}, qs);
    return returnData;
}
//# sourceMappingURL=getAll.operation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.FIELD = void 0;
exports.execute = execute;
const constants_1 = require("../../common/constants");
const selectMany_1 = require("../../common/selectMany");
const utils_1 = require("../../common/utils");
exports.FIELD = 'get';
const displayOptions = {
    show: {
        resource: ['row'],
        operation: [exports.FIELD],
    },
};
exports.description = [
    ...(0, selectMany_1.getSelectFields)(displayOptions),
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions,
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            ...displayOptions,
            show: {
                ...displayOptions.show,
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
        },
        default: constants_1.ROWS_LIMIT_DEFAULT,
        description: 'Max number of results to return',
    },
];
async function execute(index) {
    const dataTableProxy = await (0, utils_1.getDataTableProxyExecute)(this, index);
    return await (0, selectMany_1.executeSelectMany)(this, index, dataTableProxy);
}
//# sourceMappingURL=get.operation.js.map